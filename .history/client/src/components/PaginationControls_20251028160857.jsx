import React from 'react';
import {Stack, Pagination, Select, MenuItem, Typography} from '@mui/material';

export default function PaginationControls({
  meta = {},
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 20, 50],
}) {
  if (!meta) return null;

  const {page, pageCount, total} = meta;
}
