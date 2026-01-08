// src/components/market/ForecastChart.jsx

export default function ForecastChart({ revenueForecast, investmentForecast }) {
  const items = (revenueForecast || []).map((r, idx) => ({
    year: r.year,
    revenue: r.value,
    investment: investmentForecast?.[idx]?.value ?? null,
  }));

  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 h-full">
      <h2 className="text-sm font-semibold text-white mb-3">
        5-Year Forecast (Model)
      </h2>
      <div className="space-y-2 text-xs text-slate-200 max-h-72 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.year}
            className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2"
          >
            <span className="font-medium text-slate-100">{item.year}</span>
            <div className="flex gap-4">
              <div>
                <p className="text-[10px] text-slate-400">Revenue</p>
                <p className="font-semibold">
                  {item.revenue != null
                    ? item.revenue.toFixed(0)
                    : "No data"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Investment</p>
                <p className="font-semibold">
                  {item.investment != null
                    ? item.investment.toFixed(0)
                    : "No data"}
                </p>
              </div>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="text-slate-400 text-xs">Forecast data not available.</p>
        )}
      </div>
    </div>
  );
}
