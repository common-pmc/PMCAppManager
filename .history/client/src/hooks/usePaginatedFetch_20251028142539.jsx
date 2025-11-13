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
  const debouceRef = useRef (null);

  const fetchPage = useCallback (
    async (override = {}) => {
      // Merge params with any overrides
      const requestParams = {...params, ...override};
    },
    [url, params]
  );

  useEffect (
    () => {
      fetchPage ();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchPage, ...deps]
  );

  const setPage = p => setParams (prev => ({...prev, page: p}));
  const setLimit = l => setParams (prev => ({...prev, limit: l}));
  const setSearch = s => setParams (prev => ({...prev, search: s}));
  const refresh = () => fetchPage ();

  return {
    data,
    meta,
    loading,
    error,
    params,
    setParams,
    setPage,
    setLimit,
    setSearch,
  };
}
