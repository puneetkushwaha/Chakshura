// server/models/MarketReport.js
const mongoose = require("mongoose");

const MarketReportSchema = new mongoose.Schema(
  {
    reportId: { type: String, required: true, unique: true }, // MR-2024-0001
    title: { type: String, required: true },
    sector: { type: String, required: true },
    region: { type: String, required: true },
    source: { type: String, required: true }, // Gartner, McKinsey, etc.
    status: {
      type: String,
      default: "Published", // Published / Draft / Under Review / Archived
    },
    publishedOn: { type: Date, required: true },
    growthScore: { type: Number, default: 0 }, // 0–10
    cagrBand: { type: String, default: "Stable" }, // Very High / High / Moderate / Stable
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketReport", MarketReportSchema);
