// server/trl/trl.featureExtractor.js
const Patent = require("../models/Patent");
const Publication = require("../models/Publication");
const MarketReport = require("../models/MarketReport");

function yearsAgo(years) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d;
}

async function extractFeaturesForTechnology(technology) {
  const fiveYearsAgo = yearsAgo(5);
  const midDate = yearsAgo(2.5);
  const techRegex = new RegExp(technology, "i");

  // === PATENTS (last 5 years by year field) ===
  const patentsLast5y = await Patent.find({
    year: { $gte: fiveYearsAgo.getFullYear() },
    $or: [{ title: techRegex }, { abstract: techRegex }],
  });

  const patent_count_5y = patentsLast5y.length;

  const early = patentsLast5y.filter((p) => p.year < midDate.getFullYear());
  const late = patentsLast5y.filter((p) => p.year >= midDate.getFullYear());

  const earlyCount = early.length || 1;
  const lateCount = late.length;
  const patent_growth_rate = (lateCount - earlyCount) / earlyCount;

  const avg_citations =
    patentsLast5y.reduce((sum, p) => sum + (p.citationCount || 0), 0) /
      (patent_count_5y || 1) || 0;

  // === PUBLICATIONS ===
  const papersLast5y = await Publication.find({
    year: { $gte: fiveYearsAgo.getFullYear() },
    $or: [{ title: techRegex }, { abstract: techRegex }],
  });

  const paper_count_5y = papersLast5y.length;
  const research_intensity = Math.log1p(paper_count_5y);

  // === INDUSTRY / MARKET REPORTS (proxy for adoption & funding) ===
  const reportsLast5y = await MarketReport.find({
    year: { $gte: fiveYearsAgo.getFullYear() },
    $or: [{ title: techRegex }, { summary: techRegex }],
  });

  const industry_mentions = reportsLast5y.length;

  // If you have fundingAmount or similar field in MarketReport, use it here.
  const funding_total = reportsLast5y.reduce(
    (sum, r) => sum + (r.fundingAmount || 0),
    0
  );

  const reportsEarly = reportsLast5y.filter(
    (r) => r.year < midDate.getFullYear()
  );
  const reportsLate = reportsLast5y.filter(
    (r) => r.year >= midDate.getFullYear()
  );

  const fundingEarlyTotal =
    reportsEarly.reduce((sum, r) => sum + (r.fundingAmount || 0), 0) || 1;
  const fundingLateTotal = reportsLate.reduce(
    (sum, r) => sum + (r.fundingAmount || 0),
    0
  );
  const funding_trend = (fundingLateTotal - fundingEarlyTotal) / fundingEarlyTotal;

  // === MATURITY KEYWORDS from publication abstracts ===
  const maturityKeywords = {
    research: ["concept", "feasibility", "simulation"],
    development: ["prototype", "demonstration", "pilot"],
    mature: ["operational", "deployed", "fielded"],
  };

  let maturityScore = 0;
  const texts = papersLast5y.map((p) => (p.abstract || "").toLowerCase());

  texts.forEach((t) => {
    maturityKeywords.research.forEach((k) => {
      if (t.includes(k)) maturityScore += 0.1;
    });
    maturityKeywords.development.forEach((k) => {
      if (t.includes(k)) maturityScore += 0.3;
    });
    maturityKeywords.mature.forEach((k) => {
      if (t.includes(k)) maturityScore += 0.6;
    });
  });

  const maturity_keyword_score = Math.min(1, maturityScore / 50);

  // === DEPLOYMENT INDICATOR (proxy: highly positive market reports) ===
  // TODO: Replace with real deployment signal if you have it in DB.
  const deployment_indicator =
    reportsLast5y.filter((r) => r.stage === "PRODUCTION").length > 0 ? 1 : 0;

  return {
    patent_count_5y,
    patent_growth_rate,
    avg_citations,
    paper_count_5y,
    research_intensity,
    industry_mentions,
    funding_total,
    funding_trend,
    maturity_keyword_score,
    deployment_indicator,
  };
}

module.exports = {
  extractFeaturesForTechnology,
};
