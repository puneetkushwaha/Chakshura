// server/models/Patent.js
const mongoose = require("mongoose");

const PatentSchema = new mongoose.Schema(
  {
    // keep original provider id as string (e.g., "PAT0001")
    id: { type: String, index: true, sparse: true },

    // patent specific id (e.g., "P000001")
    patentId: { type: String, index: true, sparse: true },

    // main metadata
    title: { type: String, required: true, trim: true },
    abstract: { type: String, default: "" },

    // numeric / structured
    year: { type: Number, index: true },
    country: { type: String },
    ipc: { type: String },

    // source & categories
    source: { type: String, default: "chakshura_seed" },
    mainCategoryId: { type: String, index: true },
    subCategoryId: { type: String, index: true },
    subSubCategoryId: { type: String, index: true },

    // classifier
    classificationConfidence: { type: Number, min: 0, max: 1, default: null },

    // any provider-specific fields (flexible)
    raw: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    strict: false, // allow additional fields in seed JSONs
  }
);

// helpful compound index for lookups
PatentSchema.index({ patentId: 1, country: 1 });

module.exports = mongoose.models.Patent || mongoose.model("Patent", PatentSchema);
