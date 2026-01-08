// server/models/TechInvestment.js
const mongoose = require("mongoose");

const techInvestmentSchema = new mongoose.Schema(
  {},
  { strict: false, collection: "tech_investments" }
);

module.exports = mongoose.model("TechInvestment", techInvestmentSchema);
