// server/models/PatentMetadata.js
const mongoose = require("mongoose");

const patentMetadataSchema = new mongoose.Schema(
  {},
  { strict: false, collection: "patent_metadata" }
);

module.exports = mongoose.model("PatentMetadata", patentMetadataSchema);
