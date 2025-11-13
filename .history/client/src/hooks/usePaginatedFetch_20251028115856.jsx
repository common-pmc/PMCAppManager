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
}
