// server/models/GlobalMarketReport.js
const mongoose = require("mongoose");

const globalMarketReportSchema = new mongoose.Schema(
  {},
  { strict: false, collection: "global_market_reports" }
);

module.exports = mongoose.model("GlobalMarketReport", globalMarketReportSchema);
