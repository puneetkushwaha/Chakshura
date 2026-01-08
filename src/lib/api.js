// src/lib/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", params, body } = {}) {
  let url = BASE_URL + path;

  if (params && typeof params === "object") {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const err = new Error(errorBody.message || "API error");
    err.response = { data: errorBody, status: res.status };
    throw err;
  }

  return res.json();
}

const api = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) =>
    request(path, { ...options, method: "POST", body }),
  // add put / delete if needed
};

export default api;
