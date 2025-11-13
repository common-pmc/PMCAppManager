import { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

/**
 * usePaginatedFetch
 * - endpoint: string (например '/users')
 * - initialParams: { page:1, limit:10, search:'' } - задава начални стойности
 * - deps: допълнителни зависимости (напр. selectedCompany), които да тригърнат презареждане
 * - options: { debounceMs: number, autoFetch: boolean }
 */
export default function usePaginatedFetch(endpoint, initialParams = {}, deps = [], options = {}) {
  const { debounceMs = 300, autoFetch = true } = options;

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // params state
  const [params, setParams] = useState(() => ({
    page: 1,
    limit: initialParams.limit || 10,
    search: '',
    ...initialParams,
  }));

  // Abort controller ref
  const abortRef = useRef(null);
  // debounce timer ref
  const timerRef = useRef(null);
  // previous request key to avoid duplicate fetches
  const prevKeyRef = useRef(null);

  // helper: build stable key from params + endpoint + deps
  const buildKey = () => {
    // Only include the parts that affect the request
    try {
      return JSON.stringify({ endpoint, params, deps });
    } catch (e) {
      return `${endpoint}:${String(params.page)}:${String(params.limit)}:${String(params.search)}`;
    }
  };

  // core fetch function (defined with useCallback for stability if needed)
  const doFetch = useCallback(
    async (override = {}) => {
      const reqParams = { ...params, ...override };

      const key = JSON.stringify({ endpoint, params: reqParams, deps });
      // if the key equals prevKeyRef, skip (extra guard)
      if (prevKeyRef.current === key) return;

      // cancel previous
      if (abortRef.current) {
         abortRef.current.abort();
        abortRef.current = null;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get(endpoint, {
          params: reqParams,
          signal: controller.signal, // axios supports AbortController in recent versions
        });

        const responseData = res.data || {};
        // Accept both { data, meta } and { data, pagination }
        const payload = responseData.data || responseData.files || [];
        const payloadMeta = responseData.meta || responseData.pagination || {};

        setData(payload);
        setMeta(prev => ({ ...prev, ...payloadMeta }));

        // update prevKey
        prevKeyRef.current = key;
      } catch (err) {
        if (err.name === 'CanceledError' || err.message === 'canceled') {
          // cancelled — ignore
        } else {
          console.error('usePaginatedFetch error:', err);
          const msg = err.response?.data?.message || err.message || 'Грешка при зареждане';
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint] // don't include params or deps here — control re-run via buildKey effect below
  );

  // Effect: watch for real changes and debounce
  useEffect(() => {
    if (!autoFetch) return;

    const key = buildKey();

    // if same as previous key, do nothing
    if (prevKeyRef.current === key) return;

    // debounce
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      doFetch();
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // We intentionally include endpoint, params.page, params.limit, params.search, ...deps in dependencies
    // to trigger effect only when they change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, params.page, params.limit, params.search, ...(Array.isArray(deps) ? deps : [])]);

  // cleanup on unmount: abort pending request and clear timer
  useEffect(() => {
    return () => {
      if (abortRef.current) {
         abortRef.current.abort();
        abortRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // setters that avoid unnecessary state updates (prevent re-renders for same value)
  const setPage = (p) => setParams(prev => {
    const next = Number(p) || 1;
    if (prev.page === next) return prev;
    return { ...prev, page: next };
  });

  const setLimit = (l) => setParams(prev => {
    const next = Number(l) || prev.limit || 10;
    if (prev.limit === next) return prev;
    return { ...prev, limit: next, page: 1 }; // reset page
  });

  const setSearch = (s) => setParams(prev => {
    const next = typeof s === 'string' ? s.trim() : s;
    if (prev.search === next) return prev;
    return { ...prev, search: next, page: 1 }; // reset page
  });

  const setAllParams = (obj) => setParams(prev => {
    // shallow merge but avoid update if nothing changes
    const next = { ...prev, ...obj };

      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
    return next;
  });

  const refresh = () => {
    // force fetch ignoring prevKey
    prevKeyRef.current = null;
    doFetch();
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
  };
}