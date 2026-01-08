// server/routes/publications.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// 🔗 direct native collection
function getPublicationsCol() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Mongo not connected");
  return db.collection("publications");
}

/**
 * Small helper: map raw Mongo doc -> clean object
 * matching what frontend expects.
 */
function mapPublication(doc) {
  if (!doc) return null;

  return {
    // ids
    _id: doc._id,
    paperId: doc.paper_id,

    // main identity
    title: doc.title,
    year: doc.year,
    month: doc.month,
    topic: doc.topic,          // e.g. "LLMs", "Federated Learning"
    venue: doc.venue,          // conference / ArXiv etc

    // numbers
    citations: doc.citations ?? 0,
    impactScore: doc.impact_score ?? null,
    authorsCount: doc.num_authors ?? null,
    pageLength: doc.page_length ?? null,
    hasCode: doc.has_code ?? false,

    // aliases for UI labels
    authors:
      typeof doc.num_authors === "number"
        ? `${doc.num_authors} author${doc.num_authors === 1 ? "" : "s"}`
        : null,
    source: doc.venue || null,

    // keep raw in case future UI needs it
    raw: {
      paper_id: doc.paper_id,
      month: doc.month,
      topic: doc.topic,
      venue: doc.venue,
    },
  };
}

/**
 * GET /api/publications
 * Pagination + sorting
 */
router.get("/", async (req, res) => {
  try {
    const col = getPublicationsCol();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const sortType = req.query.sort || "recent";

    let sortQuery = {};
    if (sortType === "recent") sortQuery = { year: -1, month: -1 };
    else if (sortType === "oldest") sortQuery = { year: 1, month: 1 };
    else if (sortType === "impact") sortQuery = { impact_score: -1 };
    else if (sortType === "citations") sortQuery = { citations: -1 };

    const total = await col.countDocuments();

    const rawDocs = await col
      .find({})
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray();

    const data = rawDocs.map(mapPublication);

    res.json({
      items: data,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + data.length < total,
      },
    });
  } catch (err) {
    console.error("GET /api/publications error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/publications/search
 * (for now: simple regex on title/topic)
 */
router.post("/search", async (req, res) => {
  try {
    const { query, top_k = 10 } = req.body;
    if (!query) return res.status(400).json({ error: "Query required" });

    const col = getPublicationsCol();

    const rawDocs = await col
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { topic: { $regex: query, $options: "i" } },
        ],
      })
      .limit(top_k)
      .toArray();

    const data = rawDocs.map(mapPublication);

    res.json({ data });
  } catch (err) {
    console.error("POST /api/publications/search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/publications/:id
 * Full detail for modal
 */
router.get("/:id", async (req, res) => {
  try {
    const col = getPublicationsCol();
    const id = req.params.id;

    const rawDoc = await col.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!rawDoc) return res.status(404).json({ error: "Not found" });

    const doc = mapPublication(rawDoc);

    res.json(doc);
  } catch (err) {
    console.error("GET /api/publications/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
