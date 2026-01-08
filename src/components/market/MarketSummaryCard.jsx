// src/components/market/MarketSummaryCard.jsx
export default function MarketSummaryCard({ marketSize, scores }) {
  const latest = marketSize?.byYear?.[marketSize.byYear.length - 1];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-slate-900/70 border border-slate-700/60">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Latest Market Size
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">
          {latest?.revenue
            ? latest.revenue.toLocaleString()
            : "Data unavailable"}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Year {latest?.year ?? "—"}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/50">
        <p className="text-xs uppercase tracking-wide text-emerald-300">
          CAGR
        </p>
        <p className="mt-2 text-2xl font-semibold text-emerald-100">
          {marketSize?.cagr != null
            ? `${(marketSize.cagr * 100).toFixed(2)}%`
            : "—"}
        </p>
        <p className="mt-1 text-xs text-emerald-200/70">
          Estimated from historical series
        </p>
      </div>

      <div className="p-4 rounded-xl bg-indigo-900/40 border border-indigo-700/50">
        <p className="text-xs uppercase tracking-wide text-indigo-300">
          Forecast Confidence
        </p>
        <p className="mt-2 text-2xl font-semibold text-indigo-100">
          {scores?.confidence ?? 0}%
        </p>
        <p className="mt-1 text-xs text-indigo-200/70">
          Higher value = more data support
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-900/40 border border-amber-700/50">
        <p className="text-xs uppercase tracking-wide text-amber-300">
          Investment Outlook
        </p>
        <p className="mt-2 text-2xl font-semibold text-amber-100">
          {scores?.revenueForecast?.length ? "Growing" : "Mixed"}
        </p>
        <p className="mt-1 text-xs text-amber-200/70">
          Based on forecasted revenue & investments
        </p>
      </div>
    </div>
  );
}
