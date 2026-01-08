// server/models/Company.js
const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    id: { type: String, index: true, sparse: true }, // e.g., "CO0001"
    companyId: { type: String, sparse: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    country: { type: String, index: true },
    foundedYear: { type: Number },
    employeeCountRange: { type: String }, // e.g., "51-200"
    website: { type: String },
    contact: { type: String },

    // category mapping
    mainCategoryId: { type: String, index: true },
    subCategoryId: { type: String, index: true },
    subSubCategoryId: { type: String, index: true },

    // misc
    extra: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
    strict: false,
  }
);

CompanySchema.index({ name: 1 });
module.exports = mongoose.models.Company || mongoose.model("Company", CompanySchema);
