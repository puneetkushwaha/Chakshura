// server/models/ResearchArticle.js
const mongoose = require("mongoose");

const researchArticleSchema = new mongoose.Schema(
  {},
  { strict: false, collection: "research_articles" }
);

module.exports = mongoose.model("ResearchArticle", researchArticleSchema);
