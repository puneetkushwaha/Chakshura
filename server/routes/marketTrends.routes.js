// server/routes/marketTrends.routes.js
const express = require("express");
const router = express.Router();

const { getMarketTrends } = require("../controllers/marketTrends.controller");

// GET /api/market/trends?tech=QuantumComputing
router.get("/trends", getMarketTrends);

module.exports = router;
