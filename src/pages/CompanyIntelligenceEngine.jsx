import React, { useState, useEffect, useMemo } from "react";
import { FileText, TrendingUp, Download, Filter, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ------------------ LINE CHART: FUNDING MOMENTUM (STATIC) ------------------ //

const fundingTrendData = [
  { name: "Q1", enterpriseAI: 90, climateTech: 55, mobility: 60 },
  { name: "Q2", enterpriseAI: 105, climateTech: 65, mobility: 70 },
  { name: "Q3", enterpriseAI: 120, climateTech: 78, mobility: 82 },
  { name: "Q4", enterpriseAI: 135, climateTech: 92, mobility: 95 },
];

// Backend base URL
const API_BASE_URL = "http://localhost:5001";

const CompanyIntelligenceEngine = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedTechArea, setSelectedTechArea] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  // ---- FETCH COMPANIES FROM MONGO VIA BACKEND ---- //
  useEffect(() => {
    const controller = new AbortController();

    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/companies`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`API ${res.status}: ${txt}`);
        }

        const json = await res.json();
        // expecting { data: [...] }
        setCompanies(json.data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load companies.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
    return () => controller.abort();
  }, []);

  // ---- FILTER OPTIONS FROM REAL DATA ---- //
  const techAreaOptions = useMemo(
    () => [...new Set(companies.map((c) => c.techArea))].filter(Boolean).sort(),
    [companies]
  );

  const stageOptions = useMemo(
    () => [...new Set(companies.map((c) => c.stage))].filter(Boolean).sort(),
    [companies]
  );

  // ---- FILTERED COMPANIES ---- //
  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companies.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const activity = (c.latestActivity || "").toLowerCase();

      const matchesSearch =
        !query || name.includes(query) || activity.includes(query);

      const matchesTech =
        selectedTechArea === "all" || c.techArea === selectedTechArea;

      const matchesStage =
        selectedStage === "all" || c.stage === selectedStage;

      return matchesSearch && matchesTech && matchesStage;
    });
  }, [companies, search, selectedTechArea, selectedStage]);

  // ---- BAR CHART DATA: TOP 6 BY MARKET SHARE ---- //
  const companyMarketData = useMemo(() => {
    if (!companies.length) return [];

    return [...companies]
      .filter((c) => typeof c.marketShare === "number")
      .sort((a, b) => b.marketShare - a.marketShare)
      .slice(0, 6)
      .map((c) => ({
        name: c.name,
        marketShare: c.marketShare,
        funding: c.funding,
      }));
  }, [companies]);

  // ---- EXPORT CSV ---- //
  const handleExport = () => {
    if (!filteredCompanies.length) return;

    const header = [
      "Company ID",
      "Name",
      "Tech Area",
      "Market Share (%)",
      "Funding (M USD)",
      "Gov Invest (M USD)",
      "Stage",
      "Latest Activity",
    ];

    const rows = filteredCompanies.map((c) => [
      c.companyId || c.id || "",
      c.name || "",
      c.techArea || "",
      c.marketShare ?? "",
      c.funding ?? "",
      c.govInv ?? "",
      c.stage || "",
      c.latestActivity || "",
    ]);

    const escapeCell = (cell) => {
      if (cell == null) return "";
      const str = String(cell);
      if (str.includes('"') || str.includes(",") || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csv =
      header.map(escapeCell).join(",") +
      "\n" +
      rows.map((row) => row.map(escapeCell).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `company_intelligence_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-military font-bold text-white">
            COMPANY INTELLIGENCE ENGINE
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-mono">
            STRATEGIC LANDSCAPE VIEW
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm hover:bg-white/10 transition-colors"
          >
            <Filter className="w-4 h-4" /> FILTERS{" "}
            <span className="hidden sm:inline">
              {showFilters ? "HIDE" : "SHOW"}
            </span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan rounded-lg text-xs sm:text-sm font-bold hover:bg-neon-cyan hover:text-military-900 transition-colors"
          >
            <Download className="w-4 h-4" /> EXPORT
          </button>
        </div>
      </div>

      {/* Error / Loading */}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">
          Failed to load companies:
          <br />
          <span className="font-mono break-words">{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-gray-400 bg-white/5 border border-white/10 rounded p-4 text-xs">
          Loading company intelligence from MongoDB…
        </div>
      )}

      {/* Search + Filters */}
      {showFilters && !loading && (
        <div className="bg-glass-dark border border-white/10 rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
          {/* Search */}
          <div className="w-full sm:w-1/2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company or activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/30 border border-white/10 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-cyan/70"
            />
          </div>

          {/* Dropdown filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedTechArea}
              onChange={(e) => setSelectedTechArea(e.target.value)}
              className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan/70"
            >
              <option value="all">All Tech Areas</option>
              {techAreaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan/70"
            >
              <option value="all">All Stages</option>
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Share Snapshot */}
        <div className="bg-glass-dark border border-white/10 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan" />
            TOP COMPANIES BY MARKET SHARE
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyMarketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff50" />
                <YAxis
                  stroke="#ffffff50"
                  label={{
                    value: "Market Share (%)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#ffffff80",
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#050b14",
                    borderColor: "#ffffff20",
                    color: "#fff",
                  }}
                  cursor={{ fill: "#ffffff05" }}
                />
                <Legend />
                <Bar
                  dataKey="marketShare"
                  name="Market Share %"
                  fill="#00f3ff"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="funding"
                  name="Funding (M USD)"
                  fill="#ff9800"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funding Momentum */}
        <div className="bg-glass-dark border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-orange" />
            FUNDING MOMENTUM BY SEGMENT
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fundingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#ffffff50" />
                <YAxis
                  stroke="#ffffff50"
                  label={{
                    value: "Quarterly Funding (M USD)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#ffffff80",
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#050b14",
                    borderColor: "#ffffff20",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="enterpriseAI"
                  name="Enterprise AI"
                  stroke="#00f3ff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="climateTech"
                  name="ClimateTech"
                  stroke="#ff4800"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="mobility"
                  name="Mobility & EV"
                  stroke="#00ff9d"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Company Intelligence Table */}
      <div className="bg-glass-dark border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            STRATEGIC COMPANY LANDSCAPE
          </h3>
          <span className="text-[11px] text-gray-400 font-mono">
            {filteredCompanies.length} / {companies.length} COMPANIES
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400 font-mono uppercase text-xs">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Tech Area</th>
                <th className="px-6 py-4">Market Share</th>
                <th className="px-6 py-4">Funding (M USD)</th>
                <th className="px-6 py-4">Gov Invest (M USD)</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Latest Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCompanies.map((row) => (
                <tr
                  key={row._id || row.companyId}
                  className="hover:bg-white/5 transition-colors group align-top"
                >
                  <td className="px-6 py-4 font-mono text-neon-cyan">
                    {row.companyId || row.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{row.techArea}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {row.marketShare != null
                      ? `${row.marketShare.toFixed(1)}%`
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neon-green"
                            style={{
                              width: `${Math.min((row.funding || 0) / 8, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono">
                          {row.funding != null
                            ? row.funding.toFixed(1)
                            : "0.0"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neon-cyan"
                            style={{
                              width: `${Math.min((row.govInv || 0) / 3, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono">
                          {row.govInv != null ? row.govInv.toFixed(1) : "0.0"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded border border-neon-cyan/20">
                      {row.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 max-w-xl">
                    {row.latestActivity}
                  </td>
                </tr>
              ))}

              {!loading && filteredCompanies.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-xs text-gray-500"
                  >
                    No companies match your filters. Try clearing search or
                    changing tech area / stage.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyIntelligenceEngine;
