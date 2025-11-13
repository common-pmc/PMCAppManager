import React, {useState, useEffect, useCallback} from 'react';
import axiosInstance from '../api/axiosInstance';

export default function usePaginatedFetch (url, initialParams = {}, deps = []) {
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

  const fetchPage = useCallback (async (override = {}) => {
    setLoading (true);
    setError (null);
    try {
      const response = await axiosInstance.get (url);
    } catch (error) {
      //
    }
  });
}
