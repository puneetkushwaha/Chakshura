// server/routes/marketReports.js
const express = require("express");
const MarketReport = require("../models/MarketReport");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q, sector, region } = req.query;

    const filter = {};

    if (sector) filter.sector = sector;
    if (region) filter.region = region;

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { title: regex },
        { sector: regex },
        { region: regex },
        { source: regex },
      ];
    }

    const reports = await MarketReport.find(filter)
      .sort({ publishedOn: -1 })
      .limit(500);

    res.json({ data: reports });
  } catch (err) {
    console.error("Error fetching market reports:", err);
    res.status(500).json({ error: "Failed to fetch market reports" });
  }
});

module.exports = router;
