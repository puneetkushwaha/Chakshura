// server/models/CompanyIntel.js
const mongoose = require("mongoose");

const companyIntelSchema = new mongoose.Schema(
  {},
  { strict: false, collection: "company_intel" }
);

module.exports = mongoose.model("CompanyIntel", companyIntelSchema);
