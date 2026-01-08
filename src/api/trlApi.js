// frontend/src/api/trlApi.js
export async function fetchTRLForTechnology(technology) {
  const res = await fetch("http://localhost:5001/api/trl/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ technology }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`TRL API error: ${msg}`);
  }

  return res.json();
}
