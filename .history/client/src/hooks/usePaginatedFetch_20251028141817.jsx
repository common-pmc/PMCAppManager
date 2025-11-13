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
    page: 1,
    pageCount: 1,
    pageSize: initialParams.limit || 10,
  });
  const [loading, setLoading] = useState (false);
  const [error, setError] = useState (null);
  const [params, setParams] = useState ({
    page: 1,
    limit: initialParams.limit || 10,
    search: '',
    ...initialParams,
  });

  const fetchPage = useCallback (
    async (override = {}) => {
      setLoading (true);
      setError (null);
      try {
        const response = await axiosInstance.get (url, {
          params: {...params, ...override},
        });
        setData (response.data.files || response.data.data || []);
        setMeta (response.data.meta || {});
      } catch (error) {
        setError (error.response ? error.response.data : error.message);
      } finally {
        setLoading (false);
      }
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
