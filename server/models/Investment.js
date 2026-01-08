// server/models/Investment.js
const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema(
  {
    id: { type: String, index: true, sparse: true },        // e.g., "INV0001"
    investmentId: { type: String, sparse: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    amount: { type: Number },
    currency: { type: String, default: "USD" },
    year: { type: Number, index: true },
    country: { type: String, index: true },
    funder: { type: String },

    mainCategoryId: { type: String, index: true },
    subCategoryId: { type: String },
    subSubCategoryId: { type: String },

    raw: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    strict: false,
  }
);

InvestmentSchema.index({ funder: 1, year: -1 });
module.exports = mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
