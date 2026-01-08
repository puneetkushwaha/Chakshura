// src/pages/PatentIntelligence.jsx
import { useEffect, useState, useMemo } from "react";
import { fetchPatents, searchPatents, fetchPatentById } from "../services/api";

function formatDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function TRLBadge({ trl }) {
  if (!trl && trl !== 0)
    return (
      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700/30 text-slate-200">
        N/A
      </span>
    );

  let color = "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"; // high
  if (trl <= 3) color = "bg-amber-500/15 text-amber-300 border-amber-500/40";
  else if (trl <= 6) color = "bg-sky-500/15 text-sky-300 border-sky-500/40";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      TRL {trl}
    </span>
  );
}

function SearchBar({ value, onChange, onSubmit, loading }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-500">
          🔍
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search patents by title, tech domain, or keywords…"
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700/70 pl-9 pr-8 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 hidden sm:flex items-center text[0.7rem] text-slate-500">
          ⌘K
        </span>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-medium text-sm px-4 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}

function StatsStrip({ patents, loading, searchMode }) {
  const stats = useMemo(() => {
    if (!patents || patents.length === 0) return null;

    const total = patents.length;
    const withTrl = patents.filter((p) => typeof p.trl === "number");
    const withImpact = patents.filter(
      (p) => typeof p.impactScore === "number"
    );

    const avgTrl =
      withTrl.length > 0
        ? withTrl.reduce((s, p) => s + p.trl, 0) / withTrl.length
        : null;
    const avgImpact =
      withImpact.length > 0
        ? withImpact.reduce((s, p) => s + p.impactScore, 0) /
          withImpact.length
        : null;

    const early =
      patents.filter((p) => typeof p.trl === "number" && p.trl <= 3).length ||
      0;
    const mid =
      patents.filter(
        (p) => typeof p.trl === "number" && p.trl >= 4 && p.trl <= 6
      ).length || 0;
    const late =
      patents.filter((p) => typeof p.trl === "number" && p.trl >= 7).length ||
      0;

    return {
      total,
      avgTrl,
      avgImpact,
      early,
      mid,
      late,
    };
  }, [patents]);

  if (loading || !stats) return null;

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3 text-xs sm:text-sm">
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-[0.18em] text-[0.6rem] text-slate-500">
            ON SCREEN
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.25)]" />
        </div>
        <div className="text-lg sm:text-xl font-semibold text-slate-50">
          {stats.total}
        </div>
        <div className="text-[0.7rem] text-slate-400">
          patents in current {searchMode ? "search" : "view"}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex flex-col gap-1">
        <span className="uppercase tracking-[0.18em] text-[0.6rem] text-slate-500">
          AVG TRL / IMPACT
        </span>
        <div className="flex items-baseline gap-3">
          <span className="text-lg sm:text-xl font-semibold text-slate-50">
            {stats.avgTrl ? stats.avgTrl.toFixed(1) : "—"}
          </span>
          <span className="text-xs text-slate-400">
            Impact {stats.avgImpact ? stats.avgImpact.toFixed(1) : "—"}
          </span>
        </div>
        <div className="mt-1 flex gap-1.5">
          <span className="h-1.5 flex-1 rounded-full bg-amber-500/40" />
          <span className="h-1.5 flex-1 rounded-full bg-sky-500/40" />
          <span className="h-1.5 flex-1 rounded-full bg-emerald-500/40" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex flex-col gap-1">
        <span className="uppercase tracking-[0.18em] text-[0.6rem] text-slate-500">
          MATURITY MIX
        </span>
        <div className="flex items-center gap-3 text-[0.7rem] text-slate-300">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Early {stats.early}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            Mid {stats.mid}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Late {stats.late}
          </span>
        </div>
        <div className="mt-1 text-[0.65rem] text-slate-500">
          Based on TRL in current list
        </div>
      </div>
    </div>
  );
}

function PatentDetailModal({ patent, onClose }) {
  if (!patent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-cyan-400/80 mb-1">
              Patent Insight
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-50">
              {patent.title}
            </h2>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
              {patent.techDomain && (
                <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                  {patent.techDomain}
                </span>
              )}
              {patent.country && (
                <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                  {patent.country}
                </span>
              )}
              {typeof patent.trl === "number" && <TRLBadge trl={patent.trl} />}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-4 text-sm text-slate-200">
          {patent.tldr && (
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/40 px-3 py-2">
              <div className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300/80 mb-1">
                TL;DR
              </div>
              <p className="text-sm text-cyan-50 leading-relaxed">
                {patent.tldr}
              </p>
            </div>
          )}

          {patent.summary && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Summary
              </div>
              <p className="leading-relaxed text-slate-100">
                {patent.summary}
              </p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Assignee
              </div>
              <div className="text-sm text-slate-100">
                {patent.assignee || "—"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Filing Date
              </div>
              <div className="text-sm text-slate-100">
                {formatDate(patent.filingDate)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Impact Score
              </div>
              <div className="text-sm text-slate-100">
                {typeof patent.impactScore === "number"
                  ? patent.impactScore.toFixed(1)
                  : "—"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Status
              </div>
              <div className="text-xs text-slate-200">
                {patent.status || "—"}
              </div>
            </div>
          </div>

          {Array.isArray(patent.keywords) && patent.keywords.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1">
                Keywords
              </div>
              <div className="flex flex-wrap gap-2">
                {patent.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-xs text-slate-100 border border-slate-700/80"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {patent.pdfUrl && (
            <div className="pt-2">
              <a
                href={patent.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200"
              >
                Download original PDF ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PatentIntelligence() {
  const [patents, setPatents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedPatent, setSelectedPatent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (searchMode) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetchPatents({
          page: pagination.page,
          limit: pagination.limit,
          sort,
        });

        if (!cancelled) {
          setPatents(res.data || []);
          setPagination(res.pagination || pagination);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Failed to load patents");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, sort, searchMode]);

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setSearchMode(false);
      setPagination((p) => ({ ...p, page: 1 }));
      return;
    }

    try {
      setSearchLoading(true);
      setSearchMode(true);
      setError("");
      const res = await searchPatents(searchQuery.trim(), 20);
      setPatents(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to search patents");
    } finally {
      setSearchLoading(false);
    }
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSearchMode(false);
    setPagination((p) => ({ ...p, page: 1 }));
  }

  async function openPatentDetail(id) {
    try {
      setDetailLoading(true);
      const full = await fetchPatentById(id);
      setSelectedPatent(full);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load patent detail");
    } finally {
      setDetailLoading(false);
    }
  }

  const isEmpty = !loading && patents.length === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:pt-2 pb-10">
        {/* Header */}
        <div className="mb-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.32em] text-cyan-400/80">
              CHAKSHURA • PATENT RADAR
            </div>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Patent Intelligence
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
              Explore R&amp;D activity, TRL maturity, and emerging technology
              patterns across defense-relevant patents.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              <span
                className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.35)]"
                aria-hidden="true"
              />
              Live data from MongoDB
            </span>
            {searchMode && (
              <span className="text-[0.7rem] text-cyan-300">
                Semantic search active
              </span>
            )}
          </div>
        </div>

        {/* Search + Controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              loading={searchLoading}
            />
            {searchMode && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-1 text-[0.7rem] text-slate-500 hover:text-slate-300"
              >
                Clear search and show all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-400">Sort by</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className="rounded-lg bg-slate-900/70 border border-slate-700 px-2 py-1 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
            >
              <option value="recent">Most recent</option>
              <option value="oldest">Oldest</option>
              <option value="trl_high">TRL high → low</option>
              <option value="impact">Impact score</option>
            </select>
          </div>
        </div>

        {/* Stats strip */}
        <StatsStrip
          patents={patents}
          loading={loading}
          searchMode={searchMode}
        />

        {/* Error state */}
        {error && (
          <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Table / list */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="hidden md:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-3 py-3">Tech Domain</th>
                  <th className="px-3 py-3">Country</th>
                  <th className="px-3 py-3">Filing Date</th>
                  <th className="px-3 py-3">Impact</th>
                  <th className="px-3 py-3">TRL</th>
                  <th className="px-3 py-3">Keywords</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      Loading patents…
                    </td>
                  </tr>
                ) : isEmpty ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      No patents found for current filters.
                    </td>
                  </tr>
                ) : (
                  patents.map((p) => (
                    <tr
                      key={p._id}
                      className="border-t border-slate-800/80 hover:bg-slate-800/70 cursor-pointer transition-colors"
                      onClick={() => openPatentDetail(p._id)}
                    >
                      <td className="px-4 py-3 align-top">
                        <div className="font-medium text-slate-50">
                          {p.title}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {p.status}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top text-xs text-slate-200">
                        {p.techDomain || "—"}
                      </td>
                      <td className="px-3 py-3 align-top text-xs text-slate-300">
                        {p.country || "—"}
                      </td>
                      <td className="px-3 py-3 align-top text-xs text-slate-300">
                        {formatDate(p.filingDate)}
                      </td>
                      <td className="px-3 py-3 align-top text-xs text-slate-100">
                        {typeof p.impactScore === "number"
                          ? p.impactScore.toFixed(1)
                          : "—"}
                      </td>
                      <td className="px-3 py-3 align-top">
                        {"trl" in p ? (
                          <TRLBadge trl={p.trl} />
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(p.keywords) &&
                            p.keywords.slice(0, 4).map((kw) => (
                              <span
                                key={kw}
                                className="rounded-full bg-slate-800/90 px-2 py-0.5 text-[0.7rem] text-slate-100"
                              >
                                {kw}
                              </span>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-slate-800">
            {loading && (
              <div className="px-4 py-4 text-center text-sm text-slate-400">
                Loading patents…
              </div>
            )}
            {isEmpty && !loading && (
              <div className="px-4 py-4 text-center text-sm text-slate-400">
                No patents found for current filters.
              </div>
            )}
            {!loading &&
              patents.map((p) => (
                <button
                  key={p._id}
                  onClick={() => openPatentDetail(p._id)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-800/70 transition-colors"
                >
                  <div className="text-sm font-medium text-slate-50">
                    {p.title}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-2 text-[0.7rem] text-slate-400">
                    {p.techDomain && (
                      <span className="rounded-full bg-slate-900/80 px-2 py-0.5">
                        {p.techDomain}
                      </span>
                    )}
                    {typeof p.impactScore === "number" && (
                      <span className="rounded-full bg-slate-900/80 px-2 py-0.5">
                        Impact {p.impactScore.toFixed(1)}
                      </span>
                    )}
                    <span>{formatDate(p.filingDate)}</span>
                  </div>
                  <div className="mt-1">
                    {"trl" in p ? <TRLBadge trl={p.trl} /> : null}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Pagination (only for non-search mode) */}
        {!searchMode && (
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div>
              Page {pagination.page} ·{" "}
              {pagination.total ? `${pagination.total} total` : "—"}
            </div>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1 || loading}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800/80 transition"
              >
                Prev
              </button>
              <button
                disabled={!pagination.hasMore || loading}
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800/80 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <PatentDetailModal
        patent={selectedPatent}
        onClose={() => setSelectedPatent(null)}
      />

      {detailLoading && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40">
          <div className="rounded-xl bg-slate-900/90 px-4 py-2 text-xs text-slate-200 border border-slate-700 shadow-lg">
            Loading patent details…
          </div>
        </div>
      )}
    </div>
  );
}

export default PatentIntelligence;