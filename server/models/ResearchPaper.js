// server/models/ResearchPaper.js
const mongoose = require("mongoose");

const ResearchPaperSchema = new mongoose.Schema(
  {
    id: { type: String, index: true, sparse: true },    // e.g., "RP0001"
    paperId: { type: String, sparse: true },            // optional internal id
    title: { type: String, required: true, trim: true },
    abstract: { type: String, default: "" },
    year: { type: Number, index: true },
    venue: { type: String },
    authors: { type: [String], default: [] },

    // categories
    mainCategoryId: { type: String, index: true },
    subCategoryId: { type: String, index: true },
    subSubCategoryId: { type: String, index: true },

    // raw fallback
    raw: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    strict: false,
  }
);

ResearchPaperSchema.index({ title: "text", venue: 1, year: -1 });
module.exports = mongoose.models.ResearchPaper || mongoose.model("ResearchPaper", ResearchPaperSchema);
