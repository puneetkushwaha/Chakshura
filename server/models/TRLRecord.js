// server/models/TRLRecord.js
const mongoose = require("mongoose");

const reasoningSchema = new mongoose.Schema(
  {
    patent_trend: String,
    research_density: String,
    industry_adoption: String,
    funding_support: String,
  },
  { _id: false }
);

const trlRecordSchema = new mongoose.Schema(
  {
    technology: { type: String, required: true, index: true },
    trl_score: { type: Number, required: true },
    status: { type: String, required: true },
    confidence: { type: Number, required: true },
    reasoning: reasoningSchema,
    features: {}, // raw numeric features snapshot
  },
  { timestamps: true }
);

module.exports = mongoose.model("TRLRecord", trlRecordSchema);
