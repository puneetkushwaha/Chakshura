// server/services/marketTrends.service.js
const GlobalMarketReport = require("../models/GlobalMarketReport");
const CompanyIntel = require("../models/CompanyIntel");
const TechInvestment = require("../models/TechInvestment");
const PatentMetadata = require("../models/PatentMetadata");
const ResearchArticle = require("../models/ResearchArticle");

// Helper: build technology match filter
const buildTechMatch = (tech) => {
  if (!tech) return {};
  // tweak these fields to match your actual Kaggle schema
  return {
    $or: [
      { technology: tech },
      { techDomain: tech },
      { keywords: tech },
      { tags: tech },
    ],
  };
};

// (1) Market Size Trends
async function getMarketSizeTrends(tech) {
  const matchStage = buildTechMatch(tech);

  const byYear = await GlobalMarketReport.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$year",
        totalRevenue: { $sum: "$revenue" }, // adjust to your field name
        avgCAGR: { $avg: "$cagr" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topCompanies = await GlobalMarketReport.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$companyName",
        totalRevenue: { $sum: "$revenue" },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 },
  ]);

  const regionalShareRaw = await GlobalMarketReport.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$region",
        totalRevenue: { $sum: "$revenue" },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  const totalRevAll = regionalShareRaw.reduce(
    (acc, r) => acc + (r.totalRevenue || 0),
    0
  );

  const regionalShare = regionalShareRaw.map((r) => ({
    region: r._id || "Unknown",
    revenue: r.totalRevenue,
    share:
      totalRevAll > 0 ? Number(((r.totalRevenue / totalRevAll) * 100).toFixed(2)) : 0,
  }));

  // Compute CAGR from first & last year revenue (fallback if cagr not in DB)
  let cagr = null;
  if (byYear.length >= 2) {
    const start = byYear[0];
    const end = byYear[byYear.length - 1];
    const yearsDiff = end._id - start._id;
    if (yearsDiff > 0 && start.totalRevenue > 0 && end.totalRevenue > 0) {
      const ratio = end.totalRevenue / start.totalRevenue;
      cagr = Number((Math.pow(ratio, 1 / yearsDiff) - 1).toFixed(4));
    }
  }

  return {
    cagr,
    byYear: byYear.map((y) => ({
      year: y._id,
      revenue: y.totalRevenue,
      avgCAGR: y.avgCAGR || null,
    })),
    topCompanies: topCompanies.map((c) => ({
      company: c._id,
      totalRevenue: c.totalRevenue,
    })),
    regionalShare,
  };
}

// (2) Technology Growth Trends
async function getTechnologyGrowthTrends(tech) {
  const matchStage = buildTechMatch(tech);

  const publicationGrowth = await ResearchArticle.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$year",
        publications: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const patentTrends = await PatentMetadata.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$year",
        patents: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const investmentTrends = await TechInvestment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$year",
        totalInvestment: { $sum: "$investment_amount" }, // adjust field
        dealCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const startupActivity = await CompanyIntel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$founded_year",
        startups: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    publicationGrowth: publicationGrowth.map((d) => ({
      year: d._id,
      count: d.publications,
    })),
    patentTrends: patentTrends.map((d) => ({
      year: d._id,
      count: d.patents,
    })),
    investmentTrends: investmentTrends.map((d) => ({
      year: d._id,
      totalInvestment: d.totalInvestment,
      dealCount: d.dealCount,
    })),
    startupActivity: startupActivity.map((d) => ({
      year: d._id,
      count: d.startups,
    })),
  };
}

// (3) Industry Segmentation
async function getIndustrySegmentation(tech) {
  const matchStage = buildTechMatch(tech);

  const segments = await GlobalMarketReport.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$defence_segment", // e.g. "Radar", "EW", etc.
        revenue: { $sum: "$revenue" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const useCases = await GlobalMarketReport.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$use_case", // adjust to your field
        revenue: { $sum: "$revenue" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const subcategories = await GlobalMarketReport.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$subcategory", // adjust
        revenue: { $sum: "$revenue" },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  const topCompetitors = await CompanyIntel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$company_name",
        dealCount: { $sum: 1 },
        totalFunding: { $sum: "$funding_amount" },
      },
    },
    { $sort: { totalFunding: -1 } },
    { $limit: 10 },
  ]);

  return {
    segments: segments.map((s) => ({
      segment: s._id,
      revenue: s.revenue,
    })),
    useCases: useCases.map((u) => ({
      useCase: u._id,
      revenue: u.revenue,
    })),
    subcategories: subcategories.map((s) => ({
      subcategory: s._id,
      revenue: s.revenue,
    })),
    topCompetitors: topCompetitors.map((c) => ({
      company: c._id,
      dealCount: c.dealCount,
      totalFunding: c.totalFunding,
    })),
  };
}

// (4) Risk & Opportunity – RAW time series (ML layer will analyse)
async function getRiskOpportunityBaseSeries(tech) {
  const matchStage = buildTechMatch(tech);

  const invSeries = await TechInvestment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$year",
        totalInvestment: { $sum: "$investment_amount" },
        dealCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const geoSignals = await GlobalMarketReport.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$region",
        count: { $sum: 1 },
        lastYear: { $max: "$year" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return {
    investmentSeries: invSeries.map((d) => ({
      year: d._id,
      totalInvestment: d.totalInvestment,
      dealCount: d.dealCount,
    })),
    geopoliticalSignals: geoSignals.map((g) => ({
      region: g._id,
      count: g.count,
      lastYear: g.lastYear,
    })),
  };
}

module.exports = {
  getMarketSizeTrends,
  getTechnologyGrowthTrends,
  getIndustrySegmentation,
  getRiskOpportunityBaseSeries,
};
