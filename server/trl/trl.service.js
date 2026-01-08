const { runPythonTRL, trlStatusFromScore } = require("./trl.utils");
const { extractFeaturesForTechnology } = require("./trl.featureExtractor");
const TRLRecord = require("../models/TRLRecord");

async function predictTRLForTechnology(technology) {
  // 1) Extract features from Mongo
  const features = await extractFeaturesForTechnology(technology);
  console.log("🧮 Extracted TRL features for", technology, "=>", features);

  // 2) Call Python TRL logic (rule-based / ML)
  const result = await runPythonTRL(technology, features);
  console.log("🐍 Python TRL result =>", result);

  const { trl_score, confidence, reasoning } = result;
  const status = trlStatusFromScore(trl_score);

  // 3) Persist history (for audit / analytics)
  await TRLRecord.create({
    technology,
    trl_score,
    confidence,
    status,
    reasoning,
    features,
  });

  // 4) Final shape for API response
  return {
    technology,
    trl_score,
    status,
    confidence,
    reasoning,
    features,
  };
}

module.exports = {
  predictTRLForTechnology,
};
