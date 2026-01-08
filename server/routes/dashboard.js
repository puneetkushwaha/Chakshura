// server/routes/dashboard.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Patent = require("../models/Patent");
const Company = require("../models/Company");
const Investment = require("../models/Investment");
const ResearchPaper = require("../models/ResearchPaper");

/**
 * Helper to build filter object from query params
 */
const CATEGORY_MAPPING = {
    "Missile Systems": "MISSILE_SYSTEMS",
    "Unmanned & Autonomous Systems": "UNMANNED_AUTONOMOUS_SYSTEMS",
    "Electronic Warfare & Cyber": "ELECTRONIC_WARFARE_CYBER",
    "Radar & Sensor Systems": "RADAR_SENSOR_SYSTEMS",
    "C4ISR & Defence AI": "C4ISR_DEFENCE_AI",
    "Quantum Technologies": "QUANTUM_TECHNOLOGIES"
};

const mapCategoryToDb = (cat) => {
    return CATEGORY_MAPPING[cat] || cat; // Fallback to original if not found
};

const buildFilter = (req) => {
    const { category, subcategory, tech } = req.query;
    console.log(`🔍 Building filter for: category="${category}", subcategory="${subcategory}", tech="${tech}"`);

    const filter = {};
    if (category) filter.mainCategoryId = mapCategoryToDb(category);
    if (subcategory) {
        filter.subCategoryId = subcategory.toUpperCase().replace(/ /g, "_").replace(/&/g, "AND").replace(/-/g, "_");
    }
    if (tech) {
        filter.subSubCategoryId = tech.toUpperCase().replace(/ /g, "_").replace(/&/g, "AND").replace(/-/g, "_");
    }

    console.log("🛠️  Constructed DB Filter:", JSON.stringify(filter, null, 2));
    return filter;
};

/**
 * GET /api/dashboard/summary
 * Returns total counts and global stats.
 */
router.get("/summary", async (req, res) => {
    try {
        const filter = buildFilter(req);

        // Parallelize count queries for speed
        const [
            totalPatents,
            totalPapers,
            totalCompanies,
            totalInvestments
        ] = await Promise.all([
            Patent.countDocuments(filter),
            ResearchPaper.countDocuments(filter),
            Company.countDocuments(filter),
            Investment.aggregate([
                { $match: filter },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        // Calculate Average TRL
        const trlAgg = await Patent.aggregate([
            { $match: { ...filter, trl: { $exists: true, $ne: null } } },
            { $group: { _id: null, avg: { $avg: "$trl" } } }
        ]);

        // Default values if empty
        const investmentTotal = totalInvestments[0]?.total || 0;
        const avgTrl = trlAgg[0]?.avg || 0;

        // ⚠️ DEMO FALLBACK
        if (totalPatents === 0 && totalPapers === 0) {
            console.log("⚠️ No data in DB for dashboard/summary. Generating mock data.");
            return res.json({
                patents: 12450,
                papers: 8320,
                companies: 342,
                investments: 4500, // $4.5B
                avgTrl: 4.8
            });
        }

        res.json({
            patents: totalPatents,
            papers: totalPapers,
            companies: totalCompanies,
            investments: investmentTotal, // Depending on raw data, might need formatting
            avgTrl: parseFloat(avgTrl.toFixed(1))
        });

    } catch (err) {
        console.error("Error in /api/dashboard/summary:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * GET /api/dashboard/activity
 * Annual trends for Patents, Papers, and Investments (millions).
 */
router.get("/activity", async (req, res) => {
    try {
        const filter = buildFilter(req);
        const startYear = 2018;
        const endYear = new Date().getFullYear();

        // Base match with time range and user filters
        const timeFilter = { ...filter, year: { $gte: startYear, $lte: endYear } };

        const matchStage = { $match: timeFilter };
        const groupStage = { $group: { _id: "$year", count: { $sum: 1 } } };
        const sortStage = { $sort: { _id: 1 } };

        // Aggregations
        const [patentTrend, paperTrend, investmentTrend] = await Promise.all([
            Patent.aggregate([matchStage, groupStage, sortStage]),
            ResearchPaper.aggregate([matchStage, groupStage, sortStage]),
            Investment.aggregate([
                matchStage,
                { $group: { _id: "$year", count: { $sum: "$amount" } } },
                sortStage
            ])
        ]);

        // Merge into a single array
        const activityMap = new Map();

        // Initialize map
        for (let y = startYear; y <= endYear; y++) {
            activityMap.set(y, { year: y.toString(), patents: 0, papers: 0, investments: 0 });
        }

        patentTrend.forEach(i => {
            if (activityMap.has(i._id)) activityMap.get(i._id).patents = i.count;
        });
        paperTrend.forEach(i => {
            if (activityMap.has(i._id)) activityMap.get(i._id).papers = i.count;
        });
        investmentTrend.forEach(i => {
            if (activityMap.has(i._id)) activityMap.get(i._id).investments = parseFloat((i.count / 1000000).toFixed(1));
        });

        let result = Array.from(activityMap.values());

        // ⚠️ DEMO FALLBACK
        const totalActivity = result.reduce((sum, r) => sum + r.patents + r.papers + r.investments, 0);
        if (totalActivity === 0) {
            console.log("⚠️ No data in DB for dashboard/activity. Generating mock trends.");
            result = result.map((item, index) => ({
                year: item.year,
                patents: Math.floor(120 + index * 45 + Math.random() * 20),
                papers: Math.floor(80 + index * 30 + Math.random() * 15),
                investments: parseFloat((1.5 + index * 1.2 + Math.random() * 0.5).toFixed(1))
            }));
        }

        res.json(result);

    } catch (err) {
        console.error("Error in /api/dashboard/activity:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * GET /api/dashboard/geo
 * Country-wise distribution.
 */
router.get("/geo", async (req, res) => {
    try {
        const filter = buildFilter(req);

        const [patentGeo, companyGeo] = await Promise.all([
            Patent.aggregate([
                { $match: filter },
                { $group: { _id: "$country", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Company.aggregate([
                { $match: filter },
                { $group: { _id: "$country", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ])
        ]);

        // Merge logic: we want a list of countries with both counts
        // Easier approach: Just return the top countries from one (e.g. patents) and look up others, or merge all uniques.
        // For simplicity, let's take top countries by Patent count as the base.

        // Normalize country codes if needed (assuming 2-letter ISO in DB).

        const combined = patentGeo.map(p => {
            const c = companyGeo.find(c => c._id === p._id);
            return {
                country: p._id || "Unknown",
                patents: p.count,
                companies: c ? c.count : 0
            };
        });

        let results = combined;

        // ⚠️ DEMO FALLBACK
        if (results.length === 0 || results.every(r => r.patents === 0)) {
            console.log("⚠️ No data in DB for dashboard/geo. Generating mock geo data.");
            results = [
                { country: "United States", patents: 4500, companies: 120 },
                { country: "China", patents: 3800, companies: 85 },
                { country: "Russia", patents: 1200, companies: 40 },
                { country: "India", patents: 950, companies: 35 },
                { country: "France", patents: 800, companies: 28 },
                { country: "United Kingdom", patents: 750, companies: 25 },
                { country: "Germany", patents: 600, companies: 20 },
                { country: "Israel", patents: 450, companies: 18 },
                { country: "South Korea", patents: 400, companies: 15 },
                { country: "Japan", patents: 350, companies: 12 }
            ];
        }

        res.json(results);

    } catch (err) {
        console.error("Error in /api/dashboard/geo:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
