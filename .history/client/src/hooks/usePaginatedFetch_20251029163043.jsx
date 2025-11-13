
import { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function usePaginatedFetch(endpoint, initialParams = {}, deps = [], options = {}) {
  const { debounceMs = 300, autoFetch = true } = options;

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
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
    } catch (e) {
      return `${endpoint}:${p.page}:${p.limit}:${p.search}`;
    }
  };

  const doFetch = useCallback(
    async (override = {}) => {
      const reqParams = { ...params, ...override };
      const key = JSON.stringify({ endpoint, params: reqParams, deps });

      // debug: log what we will fetch
      // eslint-disable-next-line no-console
      console.log('[usePaginatedFetch] fetch attempt', endpoint, reqParams, 'key:', key, 'prevKey:', prevKeyRef.current);

      if (prevKeyRef.current === key) {
        // nothing changed
        // eslint-disable-next-line no-console
        console.log('[usePaginatedFetch] skip fetch — same key');
        return;
      }

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
          signal: controller.signal,
        });

        const responseData = res.data || {};
        const payload = responseData.data || responseData.files || [];
        const payloadMeta = responseData.meta || responseData.pagination || {};

        setData(payload);
        setMeta(prev => ({ ...prev, ...payloadMeta }));

        prevKeyRef.current = key;
        // eslint-disable-next-line no-console
        console.log('[usePaginatedFetch] fetch success', { payloadLength: payload.length, payloadMeta });
      } catch (err) {
        if (err.name === 'CanceledError' || err.message === 'canceled') {
          // canceled
          // eslint-disable-next-line no-console
          console.log('[usePaginatedFetch] fetch canceled');
        } else {
          // eslint-disable-next-line no-console
          console.error('[usePaginatedFetch] fetch error', err);
          const msg = err.response?.data?.message || err.message || 'Грешка при зареждане';
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    },
    // endpoint only — we control re-run via effect dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint]
  );

  // effect with debounce: watch only the meaningful params
  useEffect(() => {
    if (!autoFetch) return;

    const key = buildKey();

    if (prevKeyRef.current === key) {
      // nothing to do
      return;
    }

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
    // watch only these specific fields to avoid spurious triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, params.page, params.limit, params.search, ...(Array.isArray(deps) ? deps : [])]);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // setters — reset prevKey to force fetch if needed
  const setPage = (p) => setParams(prev => {
    const next = Number(p) || 1;
    if (prev.page === next) return prev;
    prevKeyRef.current = null;
    return { ...prev, page: next };
  });

  const setLimit = (l) => setParams(prev => {
    const next = Number(l) || prev.limit || 10;
    console.log('[usePaginatedFetch] setLimit called with', l, '-> next:', next);
    if (prev.limit === next) return prev;
    prevKeyRef.current = null;
    return { ...prev, limit: next, page: 1 };
  });

  const setSearch = (s) => setParams(prev => {
    const next = typeof s === 'string' ? s.trim() : s;
    if (prev.search === next) return prev;
    prevKeyRef.current = null;
    return { ...prev, search: next, page: 1 };
  });

  const setAllParams = (obj) => setParams(prev => {
    const next = { ...prev, ...obj };

      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;

    prevKeyRef.current = null;
    return next;
  });

  const refresh = () => {
    prevKeyRef.current = null;
    doFetch();
  };

  // NEW: fetchNow - force fetch with override (uses override params directly,
  // clears debounce timer so it fires immediately)
  const fetchNow = (override = {}) => {
    // clear any pending debounce
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // allow fetch even if prevKey equals current key
    prevKeyRef.current = null;
    // call doFetch with override (this will use override params immediately)
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
    fetchNow
  };
}
