// src/components/market/TrendChart.jsx

function Line({ series, colorClass }) {
  if (!series || !series.length) return null;
  const values = series.map((d) => d.value);
  const years = series.map((d) => d.year);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 100;
  const height = 40;

  const points = series
    .map((d, i) => {
      const x = (i / (series.length - 1 || 1)) * width;
      const norm = (d.value - minVal) / range;
      const y = height - norm * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full h-32 ${colorClass} stroke-2`}
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        points={points}
        className="opacity-80"
      />
    </svg>
  );
}

export default function TrendChart({
  title,
  revenueSeries,
  publicationSeries,
  patentSeries,
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60 h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <div className="flex gap-3 text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> Market
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Papers
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Patents
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Line series={revenueSeries} colorClass="text-sky-400" />
        <Line series={publicationSeries} colorClass="text-emerald-400" />
        <Line series={patentSeries} colorClass="text-amber-400" />
      </div>
    </div>
  );
}
