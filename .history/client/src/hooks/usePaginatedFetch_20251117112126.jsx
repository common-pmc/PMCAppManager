import { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function usePaginatedFetch(endpoint, initialParams = {}, deps = [], options = {}) {
  const { debounceMs = 300, autoFetch = true } = options;

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [extra, setExtra] = useState(null); // За евентуално допълнителни данни от отговора
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(() => ({
    page: 1,
    limit: initialParams.limit || 10,
    search: '',
    ...initialParams,
  }));

  const abortRef = useRef(null);
  const timerRef = useRef(null);
  const prevKeyRef = useRef(null);

  const buildKey = (p = params) => {
    try {
      return JSON.stringify({ endpoint, params: p, deps });
    } catch {
      return `${endpoint}:${p.page}:${p.limit}:${p.search}`;
    }
  };

  const doFetch = useCallback(
    async (override = {}) => {
      const reqParams = { ...params, ...override };
      const key = JSON.stringify({ endpoint, params: reqParams, deps });

      if (prevKeyRef.current === key) return; // skip duplicate fetch

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get(endpoint, {
          params: reqParams,
          signal: controller.signal,
        });

        const responseData = res.data || {};
        const payload = responseData.data || responseData.files || responseData.downloads || [];
        const payloadMeta = responseData.meta || responseData.pagination || {};

        setData(payload);
        setMeta(prev => ({ ...prev, ...payloadMeta }));
        setExtra(responseData);
        prevKeyRef.current = key;
      } catch (err) {
        if (
            err.name !== 'CanceledError' || 
            err.name !== 'AbortError' || 
            err.code !== 'ERR_CANCELED' ||
            err.message !== 'canceled'
          ) {
          return;
        }
        const msg = err.response?.data?.message || err.message || 'Грешка при зареждане на данни.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, params, deps]
  );

  // Debounced auto-fetch
  useEffect(() => {
    if (!autoFetch) return;
    const key = buildKey();

    if (prevKeyRef.current === key) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      doFetch();
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, params.page, params.limit, params.search, ...(Array.isArray(deps) ? deps : [])]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // --- Helpers ---
  const setPage = (p) =>
    setParams(prev => {
      const next = Number(p) || 1;
      if (prev.page === next) return prev;
      prevKeyRef.current = null;
      return { ...prev, page: next };
    });

  const setLimit = (l) =>
    setParams(prev => {
      const next = Number(l) || prev.limit || 10;
      if (prev.limit === next) return prev;
      prevKeyRef.current = null;
      return { ...prev, limit: next, page: 1 };
    });

  const setSearch = (s) =>
    setParams(prev => {
      const next = typeof s === 'string' ? s.trim() : s;
      if (prev.search === next) return prev;
      prevKeyRef.current = null;
      return { ...prev, search: next, page: 1 };
    });

  const setAllParams = (obj) =>
    setParams(prev => {
      const next = { ...prev, ...obj };
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      prevKeyRef.current = null;
      return next;
    });

  const refresh = () => {
    prevKeyRef.current = null;
    doFetch();
  };

  // --- NEW: fetchNow (синхронизиран и стабилен) ---
  const fetchNow = (override = {}) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const newParams = { ...params, ...override };
    const newKey = buildKey(newParams);

    setParams(prev => {
        if (JSON.stringify(prev) === JSON.stringify(newParams)) return prev;
      return newParams;
    });

    prevKeyRef.current = null;
    doFetch(override);
  };

  return {
    data,
    meta,
    loading,
    error,
    params,
    setParams: setAllParams,
    setPage,
    setLimit,
    setSearch,
    refresh,
    fetchNow,
    extra
  };
}
