import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for API data fetching
 * @param {string} endpoint - API endpoint (e.g., '/api/creators')
 * @param {object} options - { immediate: true, fallback: null }
 * @returns {{ data, loading, error, refetch }}
 */
export function useApi(endpoint, options = {}) {
  const { immediate = true, fallback = null } = options;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(`[useApi] ${endpoint}:`, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * POST helper for form submissions and actions
 * @param {string} endpoint
 * @param {object} body
 * @returns {Promise<object>}
 */
export async function postApi(endpoint, body) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `API error: ${res.status}`);
  }
  return json;
}
