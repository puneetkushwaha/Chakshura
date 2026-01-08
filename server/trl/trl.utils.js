// server/trl/trl.utils.js

// Simple yearly growth rate from array of { year, count }
function computeGrowthRate(timeSeries) {
  if (!timeSeries || timeSeries.length < 2) return 0;

  // sort by year just in case
  const sorted = [...timeSeries].sort((a, b) => a.year - b.year);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (!first.count || first.count === 0) return 0;

  const years = last.year - first.year || 1;
  const growth = (last.count - first.count) / first.count;

  return growth / years; // approx per-year growth
}

module.exports = {
  computeGrowthRate,
};
