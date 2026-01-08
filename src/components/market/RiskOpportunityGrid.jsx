// src/components/market/RiskOpportunityGrid.jsx

export default function RiskOpportunityGrid({
  opportunities,
  risks,
  confidence,
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_2fr_1fr]">
      <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/60">
        <h3 className="text-sm font-semibold text-emerald-100 mb-2">
          Opportunities
        </h3>
        <div className="space-y-2 text-xs">
          {opportunities?.map((o, i) => (
            <div
              key={i}
              className="bg-emerald-950/60 rounded-lg px-3 py-2 flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-emerald-100">{o.label}</p>
                <p className="text-emerald-200/80 mt-1">{o.reason}</p>
              </div>
              <span className="ml-3 text-sm font-semibold text-emerald-200">
                {o.score}
              </span>
            </div>
          ))}
          {!opportunities?.length && (
            <p className="text-emerald-200/70 text-xs">
              No explicit opportunities extracted.
            </p>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-rose-900/40 border border-rose-700/60">
        <h3 className="text-sm font-semibold text-rose-100 mb-2">Risks</h3>
        <div className="space-y-2 text-xs">
          {risks?.map((r, i) => (
            <div
              key={i}
              className="bg-rose-950/60 rounded-lg px-3 py-2 flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-rose-100">{r.label}</p>
                <p className="text-rose-200/80 mt-1">{r.reason}</p>
              </div>
              <span className="ml-3 text-sm font-semibold text-rose-200">
                {r.score}
              </span>
            </div>
          ))}
          {!risks?.length && (
            <p className="text-rose-200/70 text-xs">
              No explicit risks extracted.
            </p>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60">
        <h3 className="text-sm font-semibold text-slate-100 mb-2">
          Confidence
        </h3>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-20 h-20 rounded-full border-4 border-slate-700 flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {confidence ?? 0}%
            </span>
          </div>
          <p className="mt-2 text-[11px] text-center text-slate-400">
            Based on data depth & signal coherence.
          </p>
        </div>
      </div>
    </div>
  );
}
