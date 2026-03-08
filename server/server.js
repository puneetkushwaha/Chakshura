// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// 🌐 Routers
const companiesRouter = require("./routes/companies");
const marketReportsRouter = require("./routes/marketReports");
const patentsRouter = require("./routes/patents");
const publicationsRouter = require("./routes/publications"); // ⭐ Publications
const trlRouter = require("./routes/trl"); // ⭐ NEW: TRL router
const investmentsRouter = require("./routes/investments");
const dashboardRouter = require("./routes/dashboard");
const forecastingRouter = require("./routes/forecasting");
const marketTrendsRouter = require("./routes/marketTrends.routes");
const app = express();

/* ---------------------------------------------
   🌐 CORS SETTINGS
--------------------------------------------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

/* ---------------------------------------------
   🕵️ Global request logger (for debugging)
--------------------------------------------- */
app.use((req, _res, next) => {
  console.log("➡️  Incoming:", req.method, req.url);
  next();
});

/* ---------------------------------------------
   🔌 MONGO CONNECTION
--------------------------------------------- */
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ---------- Add this block (paste after your routers and before 404 handler) ----------
/**
 * POST /api/generate
 * Body: { prompt: "text..." }
 * Uses Groq API (OpenAI compatible).
 * Requires API_KEY in process.env.API_KEY
 */
app.post("/api/generate", async (req, res) => {
  try {
    const prompt = (req.body && req.body.prompt) || "";
    if (!prompt.trim()) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("[/api/generate] Missing API_KEY in environment");
      return res.status(500).json({ error: "Server misconfiguration: API_KEY missing" });
    }

    // Choose Groq model
    const model = "llama-3.3-70b-versatile"; 

    // Build request body for Groq Chat Completions API
    const body = {
      model: model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 512
    };

    const url = "https://api.groq.com/openai/v1/chat/completions";

    const glRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
    });

    if (!glRes.ok) {
      const errText = await glRes.text().catch(() => "");
      console.error("[/api/generate] Groq API error:", glRes.status, errText);
      return res.status(502).json({ error: `Groq API error: ${glRes.status}`, details: errText });
    }

    const json = await glRes.json();

    let text = "";

    // Parse Groq response
    if (json.choices && json.choices.length > 0) {
      text = json.choices[0].message.content;
    } else {
      text = JSON.stringify(json).slice(0, 3000);
    }

    return res.json({ text });
  } catch (err) {
    console.error("[/api/generate] Unexpected error:", err);
    return res.status(500).json({ error: "Generation failed", message: err?.message || String(err) });
  }
});
// ---------- end block -----

/* ---------------------------------------------
   🧠 Patent Intelligence (Direct Routes)
--------------------------------------------- */

function getCollections() {
  const db = mongoose.connection.db;
  if (!db) throw new Error("Mongo DB not ready");
  return {
    patentsCol: db.collection("patents"),
    domainsCol: db.collection("patent_domains"),
  };
}

console.log("✅ Patent Intelligence routes registered");

// GET /api/patent-domains
app.get("/api/patent-domains", async (req, res) => {
  try {
    const { domainsCol } = getCollections();

    const domains = await domainsCol
      .find(
        {},
        {
          projection: {
            _id: 0,
            tech_domain_id: 1,
            label: 1,
            top_keywords: 1,
            yearly_counts: 1,
            growth_score: 1,
            is_emerging: 1,
          },
        }
      )
      .sort({ tech_domain_id: 1 })
      .toArray();

    res.json(domains);
  } catch (err) {
    console.error("Error in /api/patent-domains:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/patent-domains/emerging
app.get("/api/patent-domains/emerging", async (req, res) => {
  try {
    const { domainsCol } = getCollections();
    const domains = await domainsCol
      .find(
        { is_emerging: true },
        {
          projection: {
            _id: 0,
            tech_domain_id: 1,
            label: 1,
            top_keywords: 1,
            yearly_counts: 1,
            growth_score: 1,
            is_emerging: 1,
          },
        }
      )
      .sort({ growth_score: -1 })
      .toArray();

    res.json(domains);
  } catch (err) {
    console.error("Error in /api/patent-domains/emerging:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/patents/:patentId/intel
app.get("/api/patents/:patentId/intel", async (req, res) => {
  try {
    const { patentsCol } = getCollections();
    const patentId = req.params.patentId;

    const patent = await patentsCol.findOne(
      { patentId },
      {
        projection: {
          _id: 0,
          patentId: 1,
          title: 1,
          abstract: 1,
          publication_date: 1,
          tags: 1,
          tech_domain_id: 1,
          tech_domain_label: 1,
          similar_patents: 1,
        },
      }
    );

    if (!patent) return res.status(404).json({ error: "Patent not found" });

    res.json(patent);
  } catch (err) {
    console.error("Error in /api/patents/:patentId/intel:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ---------------------------------------------
   🔁 ROUTERS
--------------------------------------------- */
app.use("/api/companies", companiesRouter);
app.use("/api/market-reports", marketReportsRouter);
app.use("/api/patents", patentsRouter);
app.use("/api/investments", investmentsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/market", marketTrendsRouter);
console.log("🛠️ Mounting Forecasting Router...");
if (forecastingRouter) {
  app.use("/api/forecasting", forecastingRouter);
  console.log("✅ Forecasting Router MOUNTED at /api/forecasting");
} else {
  console.error("❌ Forecasting Router is UNDEFINED. Check require('./routes/forecasting')");
}


// ⭐ Publications API
app.use(
  "/api/publications",
  (req, res, next) => {
    console.log("📡 [Publications router] hit:", req.method, req.url);
    next();
  },
  publicationsRouter
);

console.log("✅ Publications routes mounted at /api/publications");

// ⭐ NEW: TRL API (AI/ML TRL prediction)
app.use(
  "/api/trl",
  (req, res, next) => {
    console.log("📡 [TRL router] hit:", req.method, req.url);
    next();
  },
  trlRouter
);

console.log("✅ TRL routes mounted at /api/trl");

// ⭐ Missing Frontend Routes Polyfill
app.use("/api/papers", publicationsRouter); // Alias for papers
app.get("/api/rdprojects", (req, res) => {
  // Mock R&D Projects
  res.json({
    items: [
      { name: 'HACM (Hypersonic Attack Cruise Missile)', agency: 'US AFRL', budget: '$1.2B', status: 'Active', year: '2023', title: 'HACM', amount: '$1.2B' },
      { name: 'FC/ASW', agency: 'UK/France MOD', budget: '€800M', status: 'Planning', year: '2022', title: 'FC/ASW', amount: '€800M' }
    ]
  });
});

app.get("/api/taxonomy", (req, res) => {
  // Return Hierarchy
  res.json({
    categories: [
      {
        name: "Missile Systems",
        subcategories: [
          { name: "Cruise Missiles", subcategories: ["Supersonic Cruise Missiles", "Subsonic Cruise Missiles"] },
          { name: "Ballistic Missiles", subcategories: ["Short-Range Ballistic Missiles (SRBM)", "Intercontinental Ballistic Missiles (ICBM)"] },
          { name: "Hypersonic Weapons", subcategories: ["Hypersonic Glide Vehicles (HGV)", "Hypersonic Cruise Missiles"] }
        ]
      },
      {
        name: "Quantum Technologies",
        subcategories: [
          { name: "Quantum Sensing", subcategories: ["Quantum Radar", "Quantum Magnetometers"] },
          { name: "Quantum Computing", subcategories: ["Quantum Cryptanalysis", "Quantum Optimization"] }
        ]
      },
      {
        name: "Unmanned & Autonomous Systems",
        subcategories: [
          { name: "UAV / Drones", subcategories: ["Swarm Drones", "Loitering Munitions"] },
          { name: "UGV", subcategories: ["Combat UGV", "EOD UGV"] }
        ]
      },
      {
        name: "C4ISR & Defence AI",
        subcategories: [
          { name: "Battle Management", subcategories: ["JADC2", "BMS"] },
          { name: "Defence AI", subcategories: ["Autonomy", "Decision Support"] }
        ]
      }
    ]
  });
});

/* ---------------------------------------------
   ROOT TEST ROUTE
--------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API running" });
});

/* ---------------------------------------------
   404 HANDLER (debug)
--------------------------------------------- */
app.use((req, res) => {
  console.log("🚫 404 for:", req.method, req.url);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head><title>404</title></head>
      <body>
        <h1>404 Not Found</h1>
        <p>Path: ${req.method} ${req.url}</p>
      </body>
    </html>
  `);
});

/* ---------------------------------------------
   🚀 START SERVER
--------------------------------------------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
});
