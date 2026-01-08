// src/pages/ResearchInsights.jsx
import { useEffect, useMemo, useState } from "react";
import {
  fetchPublications,
  searchPublications,
  // future: fetchPublicationTrends
} from "../services/api";

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
          placeholder="Search by title, abstract, authors, keywords…"
          className="w-full rounded-xl bg-slate-900/60 border border-slate-700/70 pl-9 pr-8 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-transparent"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 hidden sm:flex items-center text-[0.7rem] text-slate-500">
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

function StatsStrip({ publications, loading, searchMode }) {
  const stats = useMemo(() => {
    if (!publications || publications.length === 0) return null;

    const total = publications.length;

    const withCitations = publications.filter(
      (p) => typeof p.citations === "number"
    );
    const withImpact = publications.filter(
      (p) => typeof p.impactScore === "number"
    );

    const avgCitations =
      withCitations.length > 0
        ? withCitations.reduce((s, p) => s + p.citations, 0) /
          withCitations.length
        : null;

    const avgImpact =
      withImpact.length > 0
        ? withImpact.reduce((s, p) => s + p.impactScore, 0) /
          withImpact.length
        : null;

    const latestYear = publications.reduce(
      (max, p) => (p.year && p.year > max ? p.year : max),
      0
    );
    const earliestYear = publications.reduce(
      (min, p) =>
        p.year && (min === 0 || p.year < min) ? p.year : min,
      0
    );

    return {
      total,
      avgCitations,
      avgImpact,
      earliestYear: earliestYear || null,
      latestYear: latestYear || null,
    };
  }, [publications]);

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
          research publications in current{" "}
          {searchMode ? "search" : "view"}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex flex-col gap-1">
        <span className="uppercase tracking-[0.18em] text-[0.6rem] text-slate-500">
          AVG CITATIONS / IMPACT
        </span>
        <div className="flex items-baseline gap-3">
          <span className="text-lg sm:text-xl font-semibold text-slate-50">
            {stats.avgCitations !== null
              ? stats.avgCitations.toFixed(1)
              : "—"}
          </span>
          <span className="text-xs text-slate-400">
            Impact{" "}
            {stats.avgImpact !== null
              ? stats.avgImpact.toFixed(1)
              : "—"}
          </span>
        </div>
        <div className="mt-1 flex gap-1.5">
          <span className="h-1.5 flex-1 rounded-full bg-cyan-500/40" />
          <span className="h-1.5 flex-1 rounded-full bg-purple-500/40" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex flex-col gap-1">
        <span className="uppercase tracking-[0.18em] text-[0.6rem] text-slate-500">
          TIME WINDOW
        </span>
        <div className="flex items-baseline gap-2 text-slate-50">
          <span className="text-lg sm:text-xl font-semibold">
            {stats.earliestYear || "—"}
          </span>
          <span className="text-xs text-slate-400">→</span>
          <span className="text-lg sm:text-xl font-semibold">
            {stats.latestYear || "—"}
          </span>
        </div>
        <div className="mt-1 text-[0.65rem] text-slate-500">
          Publication years in current list
        </div>
      </div>
    </div>
  );
}

// 🌟 DETAIL MODAL (fixed)
function PublicationDetailModal({ publication, onClose }) {
  if (!publication) return null;

  // Fallbacks from your actual schema
  const field =
    publication.field ||
    publication.techDomain ||
    "AI / ML Research";

  const hasAnyTextBlock =
    publication.tldr || publication.summary || publication.abstract;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-cyan-400/80 mb-1">
              Research Insight
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-50">
              {publication.title}
            </h2>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
              {field && (
                <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                  {field}
                </span>
              )}
              {publication.venue && (
                <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                  {publication.venue}
                </span>
              )}
              {publication.year && (
                <span className="rounded-full bg-slate-800/80 px-2 py-0.5">
                  {publication.year}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 overflow-y-auto px-6 py-4 text-sm text-slate-200">
          {/* TL;DR */}
          {publication.tldr && (
            <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/40 px-3 py-2">
              <div className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-300/80 mb-1">
                TL;DR
              </div>
              <p className="text-sm text-cyan-50 leading-relaxed">
                {publication.tldr}
              </p>
            </div>
          )}

          {/* Summary */}
          {publication.summary && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Summary
              </div>
              <p className="leading-relaxed text-slate-100">
                {publication.summary}
              </p>
            </div>
          )}

          {/* Abstract */}
          {publication.abstract && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Abstract
              </div>
              <p className="leading-relaxed text-slate-300">
                {publication.abstract}
              </p>
            </div>
          )}

          {/* Fallback block – jab upar teenon nahi hain */}
          {!hasAnyTextBlock && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Basic metadata
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                This paper is in{" "}
                <span className="text-cyan-300">
                  {field || "AI/ML"}
                </span>{" "}
                domain
                {publication.venue && (
                  <>
                    {" "}
                    and was published at{" "}
                    <span className="text-cyan-300">
                      {publication.venue}
                    </span>
                  </>
                )}{" "}
                {publication.year && (
                  <>
                    {" "}
                    in{" "}
                    <span className="text-cyan-300">
                      {publication.year}
                    </span>
                  </>
                )}
                . Detailed summaries and abstract have not been generated yet.
              </p>
            </div>
          )}

          {/* Meta grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Authors
              </div>
              <div className="text-sm text-slate-100">
                {Array.isArray(publication.authors) &&
                publication.authors.length > 0
                  ? publication.authors.join(", ")
                  : "—"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Citations
              </div>
              <div className="text-sm text-slate-100">
                {typeof publication.citations === "number"
                  ? publication.citations
                  : "—"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Impact Score
              </div>
              <div className="text-sm text-slate-100">
                {typeof publication.impactScore === "number"
                  ? publication.impactScore.toFixed(1)
                  : "—"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Source
              </div>
              <div className="text-xs text-slate-200">
                {publication.source || "Kaggle research corpus"}
              </div>
            </div>
          </div>

          {/* Keywords */}
          {Array.isArray(publication.keywords) &&
            publication.keywords.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1">
                  Keywords
                </div>
                <div className="flex flex-wrap gap-2">
                  {publication.keywords.map((kw) => (
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

          {/* Link */}
          {publication.url && (
            <div className="pt-2">
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 hover:text-cyan-200"
              >
                Open full paper ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResearchInsights() {
  const [publications, setPublications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    hasMore: false,
  });

  const [sort, setSort] = useState("recent"); // recent | oldest | citations | impact
  const [fieldFilter, setFieldFilter] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  const [selectedPublication, setSelectedPublication] = useState(null);

  // Unique fields from current list
  const fieldOptions = useMemo(() => {
    const set = new Set();
    publications.forEach((p) => {
      const f = p.field || p.techDomain;
      if (f) set.add(f);
    });
    return Array.from(set).sort();
  }, [publications]);

  // Year options from current list
  const yearOptions = useMemo(() => {
    const years = new Set();
    publications.forEach((p) => {
      if (p.year) years.add(p.year);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [publications]);

  const isEmpty = !loading && publications.length === 0;

  // Load publications list
  useEffect(() => {
    if (searchMode) return; // search mode me list API ko skip karo

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: pagination.page,
          limit: pagination.limit,
          sort,
        };

        if (fieldFilter) params.field = fieldFilter;
        if (yearFrom) params.yearFrom = yearFrom;
        if (yearTo) params.yearTo = yearTo;

        const res = await fetchPublications(params);

        if (!cancelled) {
          setPublications(res.data || []);
          setPagination(res.pagination || pagination);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Failed to load publications");
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
  }, [
    pagination.page,
    pagination.limit,
    sort,
    fieldFilter,
    yearFrom,
    yearTo,
    searchMode,
  ]);

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
      const res = await searchPublications(searchQuery.trim(), 30);
      setPublications(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to search publications");
    } finally {
      setSearchLoading(false);
    }
  }

  function handleClearSearch() {
    setSearchQuery("");
    setSearchMode(false);
    setPagination((p) => ({ ...p, page: 1 }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-10">
        {/* Header */}
        <div className="mb-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[0.65rem] uppercase tracking-[0.32em] text-cyan-400/80">
              CHAKSHURA • RESEARCH INTEL
            </div>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
              Research Insights
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
              Explore AI/ML research papers from Kaggle corpora, enriched with
              summaries, keywords, and semantic search.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.35)]" />
              Live research corpus from MongoDB
            </span>
            {searchMode && (
              <span className="text-[0.7rem] text-cyan-300">
                Semantic search active
              </span>
            )}
          </div>
        </div>

        {/* Search + filters */}
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

          <div className="flex flex-wrap gap-2 items-center text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Field</span>
              <select
                value={fieldFilter}
                onChange={(e) => {
                  setFieldFilter(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="rounded-lg bg-slate-900/70 border border-slate-700 px-2 py-1 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
              >
                <option value="">All</option>
                {fieldOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400">Year</span>
              <select
                value={yearFrom}
                onChange={(e) => {
                  setYearFrom(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="rounded-lg bg-slate-900/70 border border-slate-700 px-2 py-1 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
              >
                <option value="">From</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <span className="text-slate-500 px-1">→</span>
              <select
                value={yearTo}
                onChange={(e) => {
                  setYearTo(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="rounded-lg bg-slate-900/70 border border-slate-700 px-2 py-1 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
              >
                <option value="">To</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-400">Sort</span>
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
                <option value="citations">Citations</option>
                <option value="impact">Impact score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <StatsStrip
          publications={publications}
          loading={loading}
          searchMode={searchMode}
        />

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Cards grid */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          {loading && (
            <div className="px-4 py-6 text-center text-slate-400 text-sm">
              Loading research publications…
            </div>
          )}

          {isEmpty && !loading && (
            <div className="px-4 py-6 text-center text-slate-400 text-sm">
              No publications found for current filters.
            </div>
          )}

          {!loading && !isEmpty && (
            <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2">
              {publications.map((p) => {
                const field = p.field || p.techDomain || "AI / ML Research";
                return (
                  <button
                    key={p._id}
                    onClick={() => setSelectedPublication(p)}
                    className="text-left rounded-xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-colors p-3 sm:p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[0.7rem] uppercase tracking-[0.18em] text-cyan-400/80 mb-1">
                          {field}
                        </div>
                        <h2 className="text-sm sm:text-base font-semibold text-slate-50 line-clamp-2">
                          {p.title}
                        </h2>
                      </div>
                      {p.year && (
                        <span className="ml-2 rounded-full bg-slate-800/80 px-2 py-0.5 text-[0.7rem] text-slate-300">
                          {p.year}
                        </span>
                      )}
                    </div>

                    {p.summary && (
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3">
                        {p.summary}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-[0.7rem] text-slate-400 mt-1">
                      {Array.isArray(p.authors) && p.authors.length > 0 && (
                        <span className="truncate max-w-full">
                          👨‍🔬 {p.authors.slice(0, 3).join(", ")}
                          {p.authors.length > 3 ? " et al." : ""}
                        </span>
                      )}
                      {p.venue && (
                        <span className="rounded-full bg-slate-950/70 px-2 py-0.5">
                          {p.venue}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[0.7rem] text-slate-400">
                      <div className="flex gap-3">
                        <span>
                          Citations:{" "}
                          <span className="text-slate-100">
                            {typeof p.citations === "number"
                              ? p.citations
                              : "—"}
                          </span>
                        </span>
                        <span>
                          Impact:{" "}
                          <span className="text-slate-100">
                            {typeof p.impactScore === "number"
                              ? p.impactScore.toFixed(1)
                              : "—"}
                          </span>
                        </span>
                      </div>
                      <span className="text-cyan-300 text-[0.7rem]">
                        View details ↗
                      </span>
                    </div>

                    {Array.isArray(p.keywords) && p.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.keywords.slice(0, 4).map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full bg-slate-800/90 px-2 py-0.5 text-[0.7rem] text-slate-100"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination (only when not in search mode and not empty) */}
        {!searchMode && !isEmpty && (
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

      {/* Detail modal */}
      <PublicationDetailModal
        publication={selectedPublication}
        onClose={() => setSelectedPublication(null)}
      />
    </div>
  );
}

// ❗IMPORTANT: default export
export default ResearchInsights;
