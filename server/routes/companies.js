// server/routes/companies.js
const express = require("express");
const Company = require("../models/Company");

const router = express.Router();

// Debug log: see what we actually imported
console.log("🔍 Company model in routes/companies.js:", typeof Company);

router.get("/", async (req, res) => {
  try {
    const { q, techArea, stage } = req.query;

    const filter = {};

    if (techArea) filter.techArea = techArea;
    if (stage) filter.stage = stage;

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { latestActivity: regex }];
    }

    const companies = await Company.find(filter)
      .sort({ marketShare: -1 })
      .limit(500);

    res.json({ items: companies });
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

module.exports = router;
