// src/components/market/CompanyLeaderboard.jsx

export default function CompanyLeaderboard({ topCompanies = [], segments = [] }) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 h-full flex flex-col">
      <h2 className="text-sm font-semibold text-white mb-3">
        Top Competitors & Segments
      </h2>
      <div className="space-y-3 text-xs text-slate-200 flex-1 overflow-y-auto">
        <div>
          <p className="text-[11px] text-slate-400 mb-1">Top Companies</p>
          {topCompanies.slice(0, 5).map((c, i) => (
            <div
              key={c.company || i}
              className="flex justify-between items-center bg-slate-800/70 rounded-lg px-3 py-1.5 mb-1"
            >
              <span className="font-medium">{c.company || "Unknown"}</span>
              <span className="text-[11px] text-slate-300">
                {c.totalRevenue?.toLocaleString?.() ?? c.dealCount ?? ""}
              </span>
            </div>
          ))}
          {!topCompanies.length && (
            <p className="text-slate-400 text-xs">No company data.</p>
          )}
        </div>

        <div className="mt-2">
          <p className="text-[11px] text-slate-400 mb-1">
            Top Defence Segments
          </p>
          {segments.slice(0, 5).map((s, i) => (
            <div
              key={s.segment || i}
              className="flex justify-between items-center bg-slate-800/60 rounded-lg px-3 py-1.5 mb-1"
            >
              <span>{s.segment || "Unknown"}</span>
              <span className="text-[11px] text-slate-300">
                {s.revenue?.toLocaleString?.() ?? ""}
              </span>
            </div>
          ))}
          {!segments.length && (
            <p className="text-slate-400 text-xs">No segmentation data.</p>
          )}
        </div>
      </div>
    </div>
  );
}
