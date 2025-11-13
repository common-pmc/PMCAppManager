import React, {useMemo} from 'react';
import {Stack, Pagination, Select, MenuItem, Typography} from '@mui/material';

export default function PaginationControls({
  meta = {},
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 20, 50],
}) {
  const page = Number(meta?.page) || 1;
  const pageCount = Number(meta?.pageCount) || 1;
  const rawPageSize = meta?.pageSize ?? meta?.pageSize === 0 ? meta.pageSize : undefined;
  const pageSizeNum = rawPageSize !== undefined ? Number(rawPageSize) : (pageSizeOptions[0] || 10);
  const total = Number(meta?.total) || 0;

  const effectiveOptions = useMemo (
    () => {
      const set = new Set ((pageSizeOptions || []).map (v => Number (v)));
      if (!Number.isNaN (pageSizeNum)) set.add (Number (pageSizeNum));
      return Array.from (set)
        .filter (n => !Number.isNaN (n))
        .sort ((a, b) => a - b)
        .map (String); 
    },
    [pageSizeOptions, pageSizeNum]
  );

  const selectValue = Number.isNaN(Number(pageSizeNum)) ? '' : String(pageSizeNum);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, v) => onPageChange(Number(v))}
          color="primary"
        />
        <Typography variant="body2">Страница {page} / {pageCount} — {total} общо</Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2">Елементи:</Typography>
        <Select
          size="small"
          value={selectValue}
          onChange={(e) => {
            console.log('[PaginationControls] onChange value:', e.target.value);
            const v = e.target.value === '' ? undefined : Number(e.target.value);
            if (v !== undefined && !Number.isNaN(v)) onLimitChange(v);
          }}
        >
          {effectiveOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
}
