// server/routes/investments.js
const express = require("express");
const Investment = require("../models/Investment");

const router = express.Router();

// GET /api/investments
router.get("/", async (req, res) => {
    try {
        const { year, country, funder } = req.query;
        const filter = {};
        if (year) filter.year = parseInt(year);
        if (country) filter.country = country;
        if (funder) filter.funder = new RegExp(funder, "i");

        const investments = await Investment.find(filter)
            .sort({ year: -1 })
            .limit(100);

        res.json({ data: investments });
    } catch (err) {
        console.error("Error fetching investments:", err);
        res.status(500).json({ error: "Failed to fetch investments" });
    }
});

// GET /api/investments/:id
router.get("/:id", async (req, res) => {
    try {
        const investment = await Investment.findById(req.params.id);
        if (!investment) return res.status(404).json({ error: "Investment not found" });
        res.json(investment);
    } catch (err) {
        console.error("Error fetching investment:", err);
        res.status(500).json({ error: "Failed to fetch investment" });
    }
});

module.exports = router;
