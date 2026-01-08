// server/routes/patentIntel.js
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * Yeh router mongoose ke current connection ka use karega.
 * Isme hum do collections use kar rahe hain:
 *  - patents          (existing patents data)
 *  - patent_domains   (Python ML script ne create kari hai)
 */

function getCollections() {
  const db = mongoose.connection.db;
  const patentsCol = db.collection("patents");
  const domainsCol = db.collection("patent_domains");
  return { patentsCol, domainsCol };
}

// 1) Ek patent ka intelligence data
// GET /api/patents/:patentId/intel
router.get("/patents/:patentId/intel", async (req, res) => {
  try {
    const { patentsCol } = getCollections();
    const patentId = req.params.patentId;

    const patent = await patentsCol.findOne(
      { patentId: patentId },
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

    if (!patent) {
      return res.status(404).json({ error: "Patent not found" });
    }

    res.json(patent);
  } catch (err) {
    console.error("Error fetching patent intel:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2) Saare patent domains + trend data
// GET /api/patent-domains
router.get("/patent-domains", async (req, res) => {
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
    console.error("Error fetching patent domains:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3) Sirf emerging domains
// GET /api/patent-domains/emerging
router.get("/patent-domains/emerging", async (req, res) => {
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
    console.error("Error fetching emerging patent domains:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
