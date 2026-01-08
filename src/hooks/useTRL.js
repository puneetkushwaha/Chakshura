// frontend/src/hooks/useTRL.js
import { useState, useCallback } from "react";
import { fetchTRLForTechnology } from "../api/trlApi";

export function useTRL() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const getTRL = useCallback(async (technology) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchTRLForTechnology(technology);
      setData(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch TRL");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, data, error, getTRL };
}
