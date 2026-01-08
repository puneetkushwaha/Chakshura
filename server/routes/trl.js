// server/routes/trl.js
const express = require("express");
const router = express.Router();
const { getTRLForTechnology } = require("../trl/trl.controller");

// GET /trl?tech=QuantumComputing
router.get("/", getTRLForTechnology);

// GET /api/trl/distribution
router.get("/distribution", (req, res) => {
    // Mock Distribution
    res.json([
        { trl: 'TRL 1-2', count: 45 },
        { trl: 'TRL 3-4', count: 122 },
        { trl: 'TRL 5-6', count: 198 },
        { trl: 'TRL 7-8', count: 87 },
        { trl: 'TRL 9', count: 23 }
    ]);
});

// GET /api/trl/progression
router.get("/progression", (req, res) => {
    // Mock Progression
    res.json([
        { year: '2016', trl: 2.5 },
        { year: '2018', trl: 3.2 },
        { year: '2020', trl: 4.0 },
        { year: '2022', trl: 4.5 },
        { year: '2024', trl: 5.2 }
    ]);
});

module.exports = router;
