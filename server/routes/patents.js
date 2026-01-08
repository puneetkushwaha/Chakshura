// server/routes/patents.js
const express = require("express");
const mongoose = require("mongoose");
const { spawn } = require("child_process");

const Patent = require("../models/Patent");
// const { requireAdmin } = require("../middleware/auth"); // we'll add this file later

const router = express.Router();

/**
 * Helper: parse pagination & sorting from query
 */
function parsePagination(req) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const skip = (page - 1) * limit;

  const sortParam = (req.query.sort || "recent").toLowerCase();

  let sort = {};
  if (sortParam === "recent") {
    sort = { filingDate: -1 };
  } else if (sortParam === "oldest") {
    sort = { filingDate: 1 };
  } else if (sortParam === "trl_high") {
    sort = { trl: -1 };
  } else if (sortParam === "impact") {
    sort = { impactScore: -1 };
  } else {
    sort = { createdAt: -1 };
  }

  return { limit, page, skip, sort };
}

/**
 * GET /api/patents
 * Query params: limit, page, sort
 *
 * Response:
 * {
 *   data: [
 *     {
 *       _id, title, country, filingDate, trl, keywords, techDomain, impactScore, status
 *     }, ...
 *   ],
 *   pagination: { page, limit, total, hasMore }
 * }
 */
router.get("/", async (req, res) => {
  try {
    const { limit, page, skip, sort } = parsePagination(req);

    const filter = {};
    // Optional filters later: country, techDomain, minTrl, etc.

    const [items, total] = await Promise.all([
      Patent.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          "_id title country filingDate trl keywords techDomain impactScore status"
        )
        .lean(),
      Patent.countDocuments(filter),
    ]);

    return res.json({
      data: items,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + items.length < total,
      },
    });
  } catch (err) {
    console.error("Error in GET /api/patents:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch patents", details: err.message });
  }
});

/**
 * GET /api/patents/:id
 *
 * Returns full patent doc including summary, tldr, keywords, trl.
 *
 * Response:
 * {
 *   _id, title, assignee, status, techDomain, country,
 *   impactScore, filingDate, summary, tldr, keywords, trl, pdfUrl, ...
 * }
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid patent id" });
    }

    const patent = await Patent.findById(id).lean();

    if (!patent) {
      return res.status(404).json({ error: "Patent not found" });
    }

    return res.json(patent);
  } catch (err) {
    console.error("Error in GET /api/patents/:id:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch patent", details: err.message });
  }
});

/**
 * POST /api/patents/search
 *
 * Body: { query: string, top_k?: number }
 *
 * For now: REAL search using Mongo (no dummy) on:
 * - title
 * - techDomain
 * - keywords
 *
 * Later we can swap this internals to use your FAISS + Python semantic search
 * while keeping the same API shape.
 *
 * Response:
 * {
 *   data: [
 *     {
 *       _id, title, country, filingDate, trl, keywords, score
 *     }, ...
 *   ]
 * }
 */
router.post("/search", async (req, res) => {
  try {
    const { query, top_k } = req.body || {};
    const q = (query || "").trim();

    if (!q) {
      return res.status(400).json({ error: "query is required" });
    }

    const limit = Math.min(parseInt(top_k, 10) || 10, 50);

    // REAL Mongo filter (no dummy): regex on title/techDomain + keywords match
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const results = await Patent.find({
      $or: [
        { title: regex },
        { techDomain: regex },
        { keywords: { $elemMatch: { $regex: regex } } },
      ],
    })
      .select("_id title country filingDate trl keywords techDomain impactScore status")
      .limit(limit)
      .lean();

    // Basic scoring heuristic: more keyword matches, higher impact, higher TRL → higher score
    const scored = results.map((p) => {
      let score = 0;

      const title = (p.title || "").toLowerCase();
      const tech = (p.techDomain || "").toLowerCase();
      const kws = (p.keywords || []).map((k) => (k || "").toLowerCase());

      const qLower = q.toLowerCase();

      if (title.includes(qLower)) score += 3;
      if (tech.includes(qLower)) score += 2;

      const kwMatches = kws.filter((k) => k.includes(qLower)).length;
      score += kwMatches * 1.5;

      if (typeof p.impactScore === "number") {
        score += p.impactScore / 5.0;
      }
      if (typeof p.trl === "number") {
        score += p.trl / 2.0;
      }

      return { ...p, score };
    });

    // Sort by score desc
    scored.sort((a, b) => b.score - a.score);

    return res.json({ data: scored.slice(0, limit) });
  } catch (err) {
    console.error("Error in POST /api/patents/search:", err);
    return res.status(500).json({
      error: "Failed to search patents",
      details: err.message,
    });
  }
});

/**
 * GET /api/patents/trends
 *
 * Query: tech (string), range (like "5y" or number of years)
 *
 * Response:
 * {
 *   tech: "hypersonic",
 *   fromYear: 2020,
 *   toYear: 2025,
 *   points: [
 *     { year: 2020, count: 4 },
 *     { year: 2021, count: 7 },
 *     ...
 *   ]
 * }
 */
router.get("/trends/by-tech", async (req, res) => {
  try {
    const tech = (req.query.tech || "").trim();
    const range = (req.query.range || "5y").trim();

    if (!tech) {
      return res.status(400).json({ error: "tech query param is required" });
    }

    let years = 5;
    const match = range.match(/^(\d+)\s*y/i);
    if (match) {
      years = parseInt(match[1], 10);
    }

    const now = new Date();
    const fromYear = now.getFullYear() - years + 1;

    const pipeline = [
      {
        $match: {
          techDomain: { $regex: new RegExp(tech, "i") },
          filingDate: { $type: "date" },
        },
      },
      {
        $addFields: {
          year: { $year: "$filingDate" },
        },
      },
      {
        $match: {
          year: { $gte: fromYear },
        },
      },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const agg = await Patent.aggregate(pipeline);

    const points = agg.map((row) => ({
      year: row._id,
      count: row.count,
    }));

    return res.json({
      tech,
      fromYear,
      toYear: now.getFullYear(),
      points,
    });
  } catch (err) {
    console.error("Error in GET /api/patents/trends/by-tech:", err);
    return res
      .status(500)
      .json({ error: "Failed to compute trends", details: err.message });
  }
});

/**
 * POST /api/patents/ingest
 *
 * Admin-only endpoint (JWT middleware hook to be added).
 * Intention:
 * - Trigger Python ML pipeline to process new patents and rebuild FAISS index.
 *
 * NOTE: This actually spawns the Python process (REAL behavior).
 */
router.post("/ingest", /* requireAdmin, */ async (req, res) => {
  try {
    // You can customize which scripts to call. For now:
    // 1) process_patents.py --all (re-enrich)
    // 2) build_faiss_index.py (rebuild vector index)

    const pythonEnv = process.env.PYTHON_ENV || "python";
    const basePath = process.env.ML_BASE_PATH || "../ml/patent_intel";

    // Fire-and-forget style; you can make it await + log output if needed
    const proc = spawn(pythonEnv, ["process_patents.py", "--all"], {
      cwd: basePath,
    });

    proc.on("error", (err) => {
      console.error("Error spawning process_patents.py:", err);
    });

    proc.stdout.on("data", (data) => {
      console.log(`[ML process_patents] ${data}`);
    });

    proc.stderr.on("data", (data) => {
      console.error(`[ML process_patents ERROR] ${data}`);
    });

    // Optionally chain FAISS build after exit
    proc.on("close", (code) => {
      console.log(`process_patents.py exited with code ${code}`);

      const faissProc = spawn(pythonEnv, ["build_faiss_index.py"], {
        cwd: basePath,
      });

      faissProc.on("error", (err) => {
        console.error("Error spawning build_faiss_index.py:", err);
      });

      faissProc.stdout.on("data", (data) => {
        console.log(`[ML build_faiss_index] ${data}`);
      });

      faissProc.stderr.on("data", (data) => {
        console.error(`[ML build_faiss_index ERROR] ${data}`);
      });
    });

    return res.status(202).json({
      message:
        "Ingest & reindex triggered. ML scripts running in background on server.",
    });
  } catch (err) {
    console.error("Error in POST /api/patents/ingest:", err);
    return res.status(500).json({
      error: "Failed to trigger ingest",
      details: err.message,
    });
  }
});

module.exports = router;
