// server/models/Publication.js
const mongoose = require("mongoose");

const PublicationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    abstract: { type: String },
    authors: [{ type: String }],
    journal: { type: String },
    year: { type: Number },
    field: { type: String }, // e.g. "AI", "Machine Learning", "Computer Vision"
    source: { type: String }, // e.g. "Kaggle: ai-mlreas"

    citations: { type: Number, default: 0 },
    doi: { type: String },
    url: { type: String },

    // ML-enriched fields
    summary: { type: String },
    tldr: { type: String },
    keywords: [{ type: String }],

    // sentence-transformers embedding (saved by your Python pipeline)
    embedding: {
      type: [Number], // array of floats
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Publication", PublicationSchema);
