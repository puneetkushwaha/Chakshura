// TechConvergence.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Layers,
  Zap,
  Activity,
  TrendingUp,
  Database,
  Bolt,
  Play,
  ArrowRightCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from "recharts";

/*
  Tech Convergence Page
  - Detects converging technology pairs by keyword overlap + embedding similarity (simulated).
  - Shows: pair list, convergence score, combined S-curve, evolution charts for each tech,
          "replacement" likelihood, past performance quick stats, AI-style brief (simulated).
  - Uses realistic-looking dummy data (marked SIMULATED).
*/

// -------------------- Dummy data (SIMULATED / synthetic - for demo only) --------------------

const techCatalog = [
  // Category: Quantum Technologies
  {
    id: "QUANTUM_RADAR",
    category: "Quantum Technologies",
    subcategory: "Quantum Sensing",
    subsub: "Quantum Radar",
    keywords: ["quantum radar", "quantum illumination", "entangled photons"],
    // timeseries: year, patents, papers, investments (in M USD)
    timeseries: [
      { year: 2016, patents: 2, papers: 4, investments: 1.2 },
      { year: 2017, patents: 3, papers: 6, investments: 1.5 },
      { year: 2018, patents: 4, papers: 8, investments: 1.8 },
      { year: 2019, patents: 5, papers: 14, investments: 2.3 },
      { year: 2020, patents: 7, papers: 20, investments: 3.0 },
      { year: 2021, patents: 10, papers: 28, investments: 4.5 },
      { year: 2022, patents: 14, papers: 38, investments: 6.2 },
      { year: 2023, patents: 18, papers: 52, investments: 9.5 },
    ],
    // synthetic embedding vector (small dimensional)
    embedding: [0.21, 0.83, 0.12, 0.01, 0.34],
  },

  // Category: AI / ML for Defence
  {
    id: "AI_ML",
    category: "C4ISR & Defence AI",
    subcategory: "Defence AI / ML",
    subsub: "AI / ML Systems",
    keywords: ["machine learning", "deep learning", "model inference", "transformer"],
    timeseries: [
      { year: 2016, patents: 50, papers: 300, investments: 120 },
      { year: 2017, patents: 70, papers: 380, investments: 160 },
      { year: 2018, patents: 95, papers: 520, investments: 230 },
      { year: 2019, patents: 130, papers: 720, investments: 380 },
      { year: 2020, patents: 180, papers: 1050, investments: 600 },
      { year: 2021, patents: 260, papers: 1600, investments: 980 },
      { year: 2022, patents: 370, papers: 2400, investments: 1500 },
      { year: 2023, patents: 480, papers: 3300, investments: 2200 },
    ],
    embedding: [0.19, 0.77, 0.18, 0.02, 0.41],
  },

  // Category: Unmanned Systems
  {
    id: "DRONES",
    category: "Unmanned & Autonomous Systems",
    subcategory: "UAV / Drones",
    subsub: "Swarm Drones",
    keywords: ["drone swarm", "swarm coordination", "autonomy", "multi-agent"],
    timeseries: [
      { year: 2016, patents: 5, papers: 12, investments: 8 },
      { year: 2017, patents: 8, papers: 18, investments: 11 },
      { year: 2018, patents: 12, papers: 26, investments: 16 },
      { year: 2019, patents: 22, papers: 40, investments: 24 },
      { year: 2020, patents: 38, papers: 72, investments: 42 },
      { year: 2021, patents: 66, papers: 120, investments: 75 },
      { year: 2022, patents: 110, papers: 210, investments: 160 },
      { year: 2023, patents: 164, papers: 340, investments: 310 },
    ],
    embedding: [0.08, 0.12, 0.95, 0.02, 0.11],
  },

  // Category: Telecom / 5G
  {
    id: "FIVE_G",
    category: "Communications",
    subcategory: "5G / 6G",
    subsub: "5G Networking",
    keywords: ["5G", "low latency", "edge compute", "network slicing"],
    timeseries: [
      { year: 2016, patents: 220, papers: 320, investments: 900 },
      { year: 2017, patents: 280, papers: 420, investments: 1200 },
      { year: 2018, patents: 360, papers: 610, investments: 1700 },
      { year: 2019, patents: 460, papers: 890, investments: 2400 },
      { year: 2020, patents: 600, papers: 1200, investments: 3400 },
      { year: 2021, patents: 820, papers: 1900, investments: 5200 },
      { year: 2022, patents: 1200, papers: 2700, investments: 7600 },
      { year: 2023, patents: 1500, papers: 3600, investments: 9800 },
    ],
    embedding: [0.05, 0.10, 0.92, 0.05, 0.08],
  },

  // Category: Materials & Propulsion (example - older tech)
  {
    id: "LEGACY_RADAR",
    category: "Radar & Sensor Systems",
    subcategory: "Radar Systems",
    subsub: "Legacy Pulse-Doppler Radar",
    keywords: ["pulse doppler", "legacy radar", "mechanical scan"],
    timeseries: [
      { year: 2012, patents: 120, papers: 220, investments: 450 },
      { year: 2014, patents: 100, papers: 210, investments: 380 },
      { year: 2016, patents: 85, papers: 180, investments: 280 },
      { year: 2018, patents: 70, papers: 150, investments: 200 },
      { year: 2020, patents: 52, papers: 90, investments: 120 },
    ],
    embedding: [0.9, 0.02, 0.01, 0.01, 0.03],
  },
];

// -------------------- Helper functions for "convergence detection" --------------------

// cosine similarity for small vectors
function cosineSim(a, b) {
  const dot = a.reduce((s, ai, i) => s + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// simple keyword overlap score (Jaccard-like)
function keywordOverlap(k1 = [], k2 = []) {
  const s1 = new Set(k1.map((k) => k.toLowerCase()));
  const s2 = new Set(k2.map((k) => k.toLowerCase()));
  const inter = [...s1].filter((x) => s2.has(x)).length;
  const union = new Set([...s1, ...s2]).size || 1;
  return inter / union;
}

// Detect candidate convergences among catalog (pairwise)
function detectConvergences(catalog, opts = {}) {
  const simWeight = opts.simWeight ?? 0.6; // weight for embedding similarity
  const keyWeight = opts.keyWeight ?? 0.4; // weight for keyword overlap
  const threshold = opts.threshold ?? 0.45; // final score threshold

  const pairs = [];
  for (let i = 0; i < catalog.length; i++) {
    for (let j = i + 1; j < catalog.length; j++) {
      const A = catalog[i];
      const B = catalog[j];
      const embSim = cosineSim(A.embedding, B.embedding); // 0..1
      const kOverlap = keywordOverlap(A.keywords, B.keywords); // 0..1

      const score = embSim * simWeight + kOverlap * keyWeight;
      if (score >= threshold) {
        pairs.push({
          left: A,
          right: B,
          embSim: Number(embSim.toFixed(3)),
          kOverlap: Number(kOverlap.toFixed(3)),
          score: Number(score.toFixed(3)),
          mergedTitle: suggestMergedTitle(A, B),
        });
      }
    }
  }
  // sort descending by score
  pairs.sort((a, b) => b.score - a.score);
  return pairs;
}

// Suggest merged tech title (simple LLM-like rule)
function suggestMergedTitle(A, B) {
  // explicit good examples to mimic "real" merges
  const known = [
    { a: "Quantum Radar", b: "AI / ML Systems", title: "Quantum Machine Learning (Quantum ML)" },
    { a: "Swarm Drones", b: "5G Networking", title: "5G-enabled Swarm Coordination" },
  ];
  const aName = A.subsub;
  const bName = B.subsub;
  const found = known.find(
    (k) =>
      (aName.toLowerCase().includes(k.a.toLowerCase()) && bName.toLowerCase().includes(k.b.toLowerCase())) ||
      (aName.toLowerCase().includes(k.b.toLowerCase()) && bName.toLowerCase().includes(k.a.toLowerCase()))
  );
  if (found) return found.title;

  // fallback heuristics: A + B concatenation
  const shortA = A.subsub.split(" ").slice(0, 2).join(" ");
  const shortB = B.subsub.split(" ").slice(0, 2).join(" ");
  return `${shortA} + ${shortB} Convergence`;
}

// build combined timeseries for two techs (sum + smoothing) -> used for S-curve
function combinedTimeSeries(A, B) {
  const years = new Set();
  A.timeseries.forEach((r) => years.add(r.year));
  B.timeseries.forEach((r) => years.add(r.year));
  const sortedYears = Array.from(years).sort((x, y) => x - y);

  const out = sortedYears.map((y) => {
    const a = A.timeseries.find((r) => r.year === y) || { patents: 0, papers: 0, investments: 0 };
    const b = B.timeseries.find((r) => r.year === y) || { patents: 0, papers: 0, investments: 0 };
    return {
      year: y,
      patents: a.patents + b.patents,
      papers: a.papers + b.papers,
      investments: Number((a.investments + b.investments).toFixed(2)),
      maturityIndex: normalizeMaturityIndex(a, b),
    };
  });

  // simple moving average smoothing for maturityIndex
  for (let i = 1; i < out.length - 1; i++) {
    out[i].maturityIndex = Number(((out[i - 1].maturityIndex + out[i].maturityIndex + out[i + 1].maturityIndex) / 3).toFixed(3));
  }
  return out;
}

// naive maturity index from patents/papers/investment magnitude (0..1)
function normalizeMaturityIndex(a, b) {
  const score = (a.patents + b.patents) * 0.5 + (a.papers + b.papers) * 0.3 + (a.investments + b.investments) * 0.2;
  // scale using a plausible range
  const max = 4000; // synthetic normalizer for demo
  return Math.min(1, Number((score / max).toFixed(3)));
}

// detect if new tech is likely to "replace" old tech (simple rule)
function replacementLikelihood(oldTech, newTech) {
  // If oldTech timeseries is declining and newTech rising strongly, mark higher likelihood
  const oldRecent = oldTech.timeseries.slice(-3).map((r) => r.patents + r.papers);
  const newRecent = newTech.timeseries.slice(-3).map((r) => r.patents + r.papers);
  const slopeOld = oldRecent[2] - oldRecent[0];
  const slopeNew = newRecent[2] - newRecent[0];

  // compute basic normalized score
  const raw = (slopeNew - slopeOld) / Math.max(1, slopeOld + slopeNew);
  const likelihood = Math.max(0, Math.min(1, 0.5 + raw)); // 0..1
  return Number(likelihood.toFixed(2));
}

// -------------------- React Page --------------------

const TechConvergence = () => {
  const [threshold, setThreshold] = useState(0.45);

  // detect convergences (memoized)
  const convergences = useMemo(() => detectConvergences(techCatalog, { threshold, simWeight: 0.6, keyWeight: 0.4 }), [threshold]);

  // pick top pair if any
  const topPair = convergences[0];

  // Combined series for the top pair (if any)
  const combinedSeries = topPair ? combinedTimeSeries(topPair.left, topPair.right) : [];

  // replacement likelihood example: check LEGACY_RADAR vs QUANTUM_RADAR
  const oldTech = techCatalog.find((t) => t.id === "LEGACY_RADAR");
  const newTech = techCatalog.find((t) => t.id === "QUANTUM_RADAR");
  const replaceScore = replacementLikelihood(oldTech, newTech);

  // Simulated AI brief function (would be LLM in real system)
  function simulatedAIAnalysis(pair) {
    if (!pair) return "No significant convergences detected at current threshold.";
    // craft a concise intelligence style brief (referencing evidence counts)
    const L = pair.left;
    const R = pair.right;
    const yrs = combinedTimeSeries(L, R).map((r) => r.year);
    const firstYear = yrs[0];
    const lastYear = yrs[yrs.length - 1];
    return `AI Brief — Simulated\n\nDetected convergence between "${L.subsub}" (${L.subcategory}) and "${R.subsub}" (${R.subcategory}). Convergence score ${pair.score} (embedding sim ${pair.embSim}, keyword overlap ${pair.kOverlap}).\n\nPast performance (${firstYear}→${lastYear}) shows combined growth in patents and papers; investments accelerated from ${combinedSeries.length ? combinedSeries[0].investments : "N/A"}M to ${combinedSeries.length ? combinedSeries[combinedSeries.length - 1].investments : "N/A"}M. Estimated maturity index trending upward; predicted merging use-cases include: ${pair.mergedTitle}. Replacement likelihood for legacy systems (if applicable): ${replaceScore * 100}%.\n\nRecommendations: Monitor materials + edge-AI integration, fund small-scale prototyping, and watch country-level investments for early signals.`;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-military font-bold">Technology Convergence — Detection & Analysis</h1>
          <p className="text-sm text-gray-400 mt-1">
            Automatic detection of converging technologies (simulated demo). Focus: category → subcategory → sub-subcategory with material, evolution & replacement insights.
          </p>
        </motion.div>

        {/* Controls + Threshold */}
        <div className="flex items-center gap-4">
          <div className="bg-[#0a1625]/80 p-3 rounded-lg border border-white/10">
            <div className="text-xs text-gray-400 mb-1">Convergence score threshold</div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-64"
            />
            <div className="text-xs text-gray-300 mt-1">Current: {threshold.toFixed(2)}</div>
          </div>
          <div className="bg-[#0a1625]/80 p-3 rounded-lg border border-white/10 flex items-center gap-3">
            <Bolt className="w-5 h-5 text-neon-cyan" />
            <div>
              <div className="text-xs text-gray-400">Algorithm</div>
              <div className="text-sm text-white font-mono">Embedding sim + Keyword overlap (weighted)</div>
            </div>
          </div>
          <div className="ml-auto text-xs text-gray-500">Data: SIMULATED realistic demo</div>
        </div>

        {/* Convergence List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="col-span-2 bg-[#0a1625]/80 p-4 rounded-xl border border-white/10">
            <h3 className="text-sm text-gray-300 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neon-cyan" /> Detected Convergences
            </h3>

            {convergences.length === 0 ? (
              <div className="text-gray-400">No convergences found at this threshold. Lower the threshold to reveal softer signals.</div>
            ) : (
              convergences.map((p, i) => (
                <motion.div key={i} className="p-3 mb-3 rounded-lg bg-[#020617]/60 border border-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{p.left.subsub} ↔ {p.right.subsub}</div>
                      <div className="text-xs text-gray-400 mt-1">{p.left.category} → {p.left.subcategory} · {p.right.category} → {p.right.subcategory}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Convergence Score</div>
                      <div className="text-lg font-bold text-neon-cyan">{p.score}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>Embedding sim: {p.embSim}</div>
                    <div>Keyword overlap: {p.kOverlap}</div>
                    <div>Suggested name: <span className="text-neon-cyan">{p.mergedTitle}</span></div>
                    <div>Example use-cases: <span className="text-gray-200">edge sensing + adaptive ML</span></div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* AI Brief / Summary */}
          <div className="bg-[#0a1625]/80 p-4 rounded-xl border border-white/10">
            <h3 className="text-sm text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-orange" /> AI-style Summary (Simulated)
            </h3>
            <pre className="whitespace-pre-wrap text-xs text-gray-300 font-mono">
              {simulatedAIAnalysis(topPair)}
            </pre>
          </div>
        </div>

        {/* Top pair deep-dive */}
        {topPair ? (
          <div className="bg-[#0a1625]/80 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-400">Deep Dive</div>
                <h2 className="text-lg font-bold">{topPair.left.subsub} ↔ {topPair.right.subsub} — {topPair.mergedTitle}</h2>
                <div className="text-xs text-gray-500 mt-1">{topPair.left.category} / {topPair.left.subcategory}  ·  {topPair.right.category} / {topPair.right.subcategory}</div>
              </div>
              <div className="text-xs text-gray-400">Score: <span className="text-neon-cyan font-bold">{topPair.score}</span></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left: Evolution time series for both techs */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="bg-[#08121b] p-3 rounded border border-white/5">
                    <div className="text-xs text-gray-400">Left Tech</div>
                    <div className="text-sm text-white font-bold">{topPair.left.subsub}</div>
                    <div className="text-xs text-gray-300 mt-1">{topPair.left.subcategory}</div>
                  </div>
                  <div className="bg-[#08121b] p-3 rounded border border-white/5">
                    <div className="text-xs text-gray-400">Right Tech</div>
                    <div className="text-sm text-white font-bold">{topPair.right.subsub}</div>
                    <div className="text-xs text-gray-300 mt-1">{topPair.right.subcategory}</div>
                  </div>
                  <div className="bg-[#08121b] p-3 rounded border border-white/5">
                    <div className="text-xs text-gray-400">Merged Signal</div>
                    <div className="text-sm text-neon-cyan font-bold">{topPair.mergedTitle}</div>
                    <div className="text-xs text-gray-300 mt-1">Predicted convergence use-cases</div>
                  </div>
                </div>

                <div className="bg-[#08121b] p-3 rounded border border-white/5">
                  <div className="text-xs text-gray-400 mb-2">Patents & Papers — Time Series (combined)</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={combinedSeries}>
                      <defs>
                        <linearGradient id="gPat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gPap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#092234" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="patents" stroke="#00f3ff" fill="url(#gPat)" strokeWidth={2} />
                      <Area type="monotone" dataKey="papers" stroke="#a855f7" fill="url(#gPap)" strokeWidth={2} />
                      <Line type="monotone" dataKey="investments" stroke="#f97316" dot={{ r: 3 }} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: S-curve + Replacement likelihood */}
              <div>
                <div className="bg-[#08121b] p-3 rounded border border-white/5 mb-3">
                  <div className="text-xs text-gray-400 mb-2">Normalised S-curve (Maturity Index)</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={combinedSeries}>
                      <CartesianGrid stroke="#092234" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="maturityIndex" stroke="#10b981" fill="#10b98133" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-gray-300 mt-2">Interpretation: rising maturity index indicates accelerated convergence & increased readiness for prototypes.</div>
                </div>

                <div className="bg-[#08121b] p-3 rounded border border-white/5">
                  <div className="text-xs text-gray-400">Legacy Replacement Likelihood</div>
                  <div className="mt-2 text-3xl font-bold text-neon-cyan">{Math.round(replaceScore * 100)}%</div>
                  <div className="text-xs text-gray-300 mt-2">
                    Simple model: compares decline in legacy activity vs rise in new tech activity. Use as a signal, not proof.
                  </div>
                </div>
              </div>
            </div>

            {/* Material / insight / how new replaces old */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#08121b] p-3 rounded border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Material Signals</div>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Increase in entangled-photon experimental patents (simulated → strong).</li>
                  <li>• Rise in edge-ML publications combining low-latency inference (simulated).</li>
                  <li>• Growing investment in cryogenic sensors & low-power inference (simulated).</li>
                </ul>
              </div>
              <div className="bg-[#08121b] p-3 rounded border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Past Performance</div>
                <div className="text-xs text-gray-300">
                  <div>Patents (left tech recent): {topPair.left.timeseries.slice(-1)[0].patents}</div>
                  <div>Papers (right tech recent): {topPair.right.timeseries.slice(-1)[0].papers}</div>
                  <div>Combined investments (latest): {combinedSeries.length ? combinedSeries[combinedSeries.length - 1].investments + "M" : "N/A"}</div>
                </div>
              </div>
              <div className="bg-[#08121b] p-3 rounded border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Evolution & Replacement</div>
                <div className="text-xs text-gray-300">
                  <div>• New tech augments sensing capability with adaptive ML.</div>
                  <div>• Legacy radar decline flagged — monitor field demos & prototyping.</div>
                  <div>• If investments double in 2 years, replacement risk becomes high.</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Bottom: How convergence detection works (explain) */}
        <div className="bg-[#0a1625]/80 p-4 rounded-xl border border-white/10 text-sm text-gray-300">
          <h4 className="text-xs text-gray-400 mb-2">How Convergence Detection Works (Simplified)</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Compute embeddings for each technology (semantic vector) and extract keywords from titles/abstracts.</li>
            <li>Compute cosine similarity between embeddings + keyword overlap score.</li>
            <li>Combine scores with weights → detect high-probability convergence pairs.</li>
            <li>For each pair, build a combined timeseries and maturity (S-curve) to visualise evolution.</li>
            <li>Estimate replacement likelihood by comparing decline of legacy vs rise of emerging tech.</li>
            <li>LLM (real system) writes concise intelligence brief — here we simulate the brief for demo.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TechConvergence;
