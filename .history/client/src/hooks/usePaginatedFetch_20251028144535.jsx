import React, {useState, useEffect, useCallback, useRef} from 'react';
import axiosInstance from '../api/axiosInstance';

export default function usePaginatedFetch (
  url,
  initialParams = {},
  deps = [],
  options = {}
) {
  const {
    initialPage = 1,
    initialLimit = initialParams.limit || 10,
    debounceMs = 300,
    autoFetch = true,
  } = options;

  const [data, setData] = useState ([]);
  const [meta, setMeta] = useState ({
    total: 0,
    page: initialPage,
    pageCount: 1,
    pageSize: initialLimit,
  });
  const [loading, setLoading] = useState (false);
  const [error, setError] = useState (null);

  const [params, setParams] = useState ({
    page: initialPage,
    limit: initialLimit,
    search: '',
    ...initialParams,
  });

  const abortControllerRef = useRef (null);
  const debounceRef = useRef (null);

  const fetchPage = useCallback (
    async (override = {}) => {
      // merge params with override
      const requestParams = {...params, ...override};

      // cancel previous
      if (abortControllerRef.current) {
        abortControllerRef.current.abort ();
      }
      const controller = new AbortController ();
      abortControllerRef.current = controller;

      setLoading (true);
      setError (null);

      try {
        const res = await axiosInstance.get (url, {
          params: requestParams,
          signal: controller.signal, // axios v0.22+ supports AbortController
        });

        // Accept both shapes: {data, meta} or {data, pagination}
        const responseData = res.data || {};
        const resultData = responseData.data || responseData.files || [];
        const resultMeta = responseData.meta || responseData.pagination || {};

        setData (resultData);
        setMeta (prev => ({...prev, ...resultMeta}));
        // also sync params.page/limit with response if provided
        if (resultMeta.page)
          setParams (prev => ({...prev, page: resultMeta.page}));
        if (resultMeta.pageSize)
          setParams (prev => ({...prev, limit: resultMeta.pageSize}));
      } catch (err) {
        if (err.name === 'CanceledError' || err.message === 'canceled') {
          // request cancelled — ignore
        } else {
          setError (err.response ? err.response.data : err.message);
        }
      } finally {
        setLoading (false);
        abortControllerRef.current = null;
      }
    },
    [url, params]
  );

  // debounced auto fetch on params change
  useEffect (
    () => {
      if (!autoFetch) return;

      if (debounceRef.current) clearTimeout (debounceRef.current);
      debounceRef.current = setTimeout (() => {
        fetchPage ();
      }, debounceMs);

      return () => {
        if (debounceRef.current) clearTimeout (debounceRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [fetchPage, ...deps, params.page, params.limit, params.search]
  );

  // helpers to modify params and trigger fetch (no immediate fetch — auto effect handles it)
  const setPage = p => setParams (prev => ({...prev, page: p}));
  const setLimit = l => setParams (prev => ({...prev, limit: l, page: 1}));
  const setSearch = s => setParams (prev => ({...prev, search: s, page: 1}));
  const setAllParams = p => setParams (prev => ({...prev, ...p}));
  const refresh = () => fetchPage (); // immediate refresh

  // cleanup on unmount
  useEffect (
    () => () => {
      if (abortControllerRef.current) abortControllerRef.current.abort ();
    },
    []
  );

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
    fetchPage, // direct call if needed with override
  };
}
