// src/components/market/InvestmentTimeline.jsx

export default function InvestmentTimeline({ investmentTrend }) {
  const series = investmentTrend?.historical || [];

  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 h-full">
      <h2 className="text-sm font-semibold text-white mb-3">
        Investment Timeline & Shocks
      </h2>
      <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
        {series.map((s) => (
          <div
            key={s.year}
            className="flex justify-between items-center bg-slate-800/70 rounded-lg px-3 py-2"
          >
            <div>
              <p className="font-medium text-slate-100">{s.year}</p>
              <p className="text-slate-300">
                Deals: {s.dealCount ?? "—"}
              </p>
            </div>
            <p className="font-semibold text-emerald-200">
              {s.totalInvestment?.toLocaleString?.() ?? "—"}
            </p>
          </div>
        ))}
        {!series.length && (
          <p className="text-slate-400 text-xs">
            No investment trend data available.
          </p>
        )}

        {investmentTrend?.shocks?.length ? (
          <div className="mt-3">
            <p className="text-[11px] text-amber-300 mb-1">Shock Events</p>
            {investmentTrend.shocks.map((s, i) => (
              <div
                key={i}
                className="bg-amber-900/40 border border-amber-700/60 rounded-lg px-3 py-2 mb-1"
              >
                <p className="text-amber-100 text-xs font-medium">
                  {s.fromYear} → {s.toYear}
                </p>
                <p className="text-amber-200/90 text-[11px]">
                  {s.description} ({(s.change * 100).toFixed(1)}%)
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
