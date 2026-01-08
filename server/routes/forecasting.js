// server/routes/forecasting.js
const express = require('express');
const router = express.Router();

// GET /api/forecasting/stats?category=&subcategory=&tech=
router.get('/stats', async (req, res) => {
    try {
        const db = req.app.get('db') || require('mongoose').connection.db;
        const patentsCol = db.collection('patents');
        const pubsCol = db.collection('publications');
        const investCol = db.collection('investments');
        const trlCol = db.collection('trl_metrics');

        const { category, subcategory, tech } = req.query;
        const buildFilter = () => {
            const f = {};
            if (tech) f.$or = [
                { title: { $regex: tech, $options: 'i' } },
                { abstract: { $regex: tech, $options: 'i' } },
                { tags: { $in: [new RegExp(tech, 'i')] } }
            ];
            if (category) f['meta.category'] = category;
            if (subcategory) f['meta.subcategory'] = subcategory;
            return f;
        };
        const filter = buildFilter();

        const [patentsCount, papersCount, investAgg, trlDoc] = await Promise.all([
            patentsCol.countDocuments(filter),
            pubsCol.countDocuments(filter),
            investCol.aggregate([{ $match: filter }, { $group: { _id: null, total: { $sum: "$amount" } } }]).toArray(),
            trlCol.findOne({ tech }, { projection: { avgTrl: 1, deploymentYear: 1, deploymentTime: 1 } })
        ]);

        const investments = investAgg[0] ? investAgg[0].total : 0;
        const avgTrl = trlDoc ? trlDoc.avgTrl || 0 : 0;

        res.json({
            patents: patentsCount,
            papers: papersCount,
            investments,
            avgTrl,
            growthRate: trlDoc?.growthRate ?? null,
            deploymentTime: trlDoc?.deploymentTime ?? null,
            deploymentYear: trlDoc?.deploymentYear ?? null
        });
    } catch (err) {
        console.error('Error /api/forecasting/stats', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/forecasting/activity?category=&subcategory=&tech=
router.get('/activity', async (req, res) => {
    try {
        const db = req.app.get('db') || require('mongoose').connection.db;
        const patentsCol = db.collection('patents');
        const pubsCol = db.collection('publications');

        const { category, subcategory, tech } = req.query;
        const buildFilter = () => {
            const f = {};
            if (tech) f.$or = [
                { title: { $regex: tech, $options: 'i' } },
                { abstract: { $regex: tech, $options: 'i' } }
            ];
            if (category) f['meta.category'] = category;
            if (subcategory) f['meta.subcategory'] = subcategory;
            return f;
        };
        const filter = buildFilter();

        const patentsAgg = await patentsCol.aggregate([
            { $match: filter },
            { $group: { _id: "$year", patents: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        const papersAgg = await pubsCol.aggregate([
            { $match: filter },
            { $group: { _id: "$year", papers: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        // merge results into tidy array
        const years = new Set([...patentsAgg.map(a => a._id), ...papersAgg.map(a => a._id)]);
        const out = Array.from(years).sort().map(year => {
            const p = patentsAgg.find(a => a._id === year);
            const pa = papersAgg.find(a => a._id === year);
            return { year: String(year), patents: p ? p.patents : 0, papers: pa ? pa.papers : 0, rd: 0 };
        });

        res.json(out);
    } catch (err) {
        console.error('Error /api/forecasting/activity', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/forecasting/trl?tech=
router.get('/trl', async (req, res) => {
    try {
        const db = req.app.get('db') || require('mongoose').connection.db;
        const trlCol = db.collection('trl_metrics');
        const { tech } = req.query;
        const filter = {};
        if (tech) filter.tech = tech;

        const doc = await trlCol.findOne(filter);
        if (doc && doc.progression) return res.json(doc.progression);

        // fallback sample progression
        return res.json([
            { year: '2016', trl: 2.5, type: 'past' },
            { year: '2018', trl: 3.2, type: 'past' },
            { year: '2020', trl: 4.0, type: 'past' },
            { year: '2022', trl: 4.5, type: 'past' },
            { year: '2024', trl: 5.2, type: 'predicted' }
        ]);
    } catch (err) {
        console.error('Error /api/forecasting/trl', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/forecasting/signals?category=&subcategory=&tech=
router.get('/signals', async (req, res) => {
    try {
        const db = req.app.get('db') || require('mongoose').connection.db;
        const patentsCol = db.collection('patents');
        const investCol = db.collection('investments');
        const { category, subcategory, tech } = req.query;
        const buildFilter = () => {
            const f = {};
            if (tech) f.$or = [
                { title: { $regex: tech, $options: 'i' } },
                { abstract: { $regex: tech, $options: 'i' } }
            ];
            if (category) f['meta.category'] = category;
            if (subcategory) f['meta.subcategory'] = subcategory;
            return f;
        };
        const filter = buildFilter();

        // quick heuristics: patent spike + investment amount
        const patentsByYear = await patentsCol.aggregate([
            { $match: filter },
            { $group: { _id: "$year", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]).toArray();

        const investAgg = await investCol.aggregate([
            { $match: filter },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]).toArray();

        const totalInv = investAgg[0] ? investAgg[0].total : 0;
        const signals = [];

        // patent growth detection (very simple)
        if (patentsByYear.length >= 2) {
            const first = patentsByYear[0].count || 0;
            const last = patentsByYear[patentsByYear.length - 1].count || 0;
            if (first > 0) {
                const years = Math.max(1, patentsByYear[patentsByYear.length - 1]._id - patentsByYear[0]._id);
                const cagr = Math.pow(last / first || 1, 1 / years) - 1;
                const pct = Math.round(cagr * 100);
                if (pct > 15) signals.push({ type: 'positive', text: `Patent filings CAGR ~${pct}% — rapid innovation`, impact: 'High' });
                else if (pct < 0) signals.push({ type: 'risk', text: `Patent filings decline ${pct}% — slowdown signal`, impact: 'Medium' });
                else signals.push({ type: 'neutral', text: `Patent CAGR ~${pct}%`, impact: 'Low' });
            }
        }

        if (totalInv > 0) {
            signals.push({ type: 'positive', text: `Detected investments totalling ${totalInv.toLocaleString()}`, impact: 'Medium' });
        }

        if (signals.length === 0) {
            signals.push({ type: 'neutral', text: 'No major signals detected', impact: 'Low' });
        }

        res.json(signals);
    } catch (err) {
        console.error('Error /api/forecasting/signals', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
