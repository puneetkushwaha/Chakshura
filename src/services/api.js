// src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Helper to build query string
function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/* ---------------------------------------------
   🔥 PATENT API (unchanged from your original)
----------------------------------------------*/

// ---- 1) List patents ----
export async function fetchPatents({ page = 1, limit = 20, sort = "recent" } = {}) {
  const query = buildQuery({ page, limit, sort });
  const res = await fetch(`${API_BASE_URL}/api/patents${query}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch patents: ${res.status} ${text}`);
  }

  return res.json();
}

// ---- 2) Single patent by id ----
export async function fetchPatentById(id) {
  const res = await fetch(`${API_BASE_URL}/api/patents/${id}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch patent: ${res.status} ${text}`);
  }

  return res.json();
}

// ---- 3) Search patents ----
export async function searchPatents(query, topK = 10) {
  const res = await fetch(`${API_BASE_URL}/api/patents/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to search patents: ${res.status} ${text}`);
  }

  return res.json();
}

// ---- 4) Trends by tech ----
export async function fetchPatentTrends(tech, range = "5y") {
  const query = buildQuery({ tech, range });
  const res = await fetch(`${API_BASE_URL}/api/patents/trends/by-tech${query}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch patent trends: ${res.status} ${text}`);
  }

  return res.json();
}

/* ------------------------------------------------
   🔥 PUBLICATION / RESEARCH API (NEW ADDITION)
-------------------------------------------------*/

// ---- 1) List publications ----
export async function fetchPublications({
  page = 1,
  limit = 20,
  sort = "recent",
  yearFrom,
  yearTo,
  field,
} = {}) {
  const query = buildQuery({ page, limit, sort, yearFrom, yearTo, field });

  const res = await fetch(`${API_BASE_URL}/api/publications${query}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch publications: ${res.status} ${text}`);
  }

  return res.json();
}

// ---- 2) Search publications (semantic vector search) ----
export async function searchPublications(query, topK = 20) {
  const res = await fetch(`${API_BASE_URL}/api/publications/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to search publications: ${res.status} ${text}`);
  }

  return res.json();
}

// ---- 3) Single publication detail ----
export async function fetchPublicationById(id) {
  const res = await fetch(`${API_BASE_URL}/api/publications/${id}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch publication: ${res.status} ${text}`);
  }

  return res.json();
}
