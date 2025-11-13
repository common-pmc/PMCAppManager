import React, {useMemo} from 'react';
import {Stack, Pagination, Select, MenuItem, Typography} from '@mui/material';

export default function PaginationControls({
  meta = {},
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 20, 50],
}) {
  const page = Number (meta.page) || 1;
  const pageCount = Number (meta.pageCount) || 1;
  const pageSize =
    Number (
      meta.pageSize || meta.pageSize === 0 ? meta.pageSize : meta.pageSize
    ) ||
    Number (meta.pageSize) ||
    (pageSizeOptions[0] || 10);
  const total = Number (meta.total) || 0;

  const effectiveOptions = useMemo (
    () => {
      const set = new Set ((pageSizeOptions || []).map (v => Number (v)));
      if (!Number.isNaN (pageSizeNum)) set.add (Number (pageSizeNum));
      return Array.from (set)
        .filter (n => !Number.isNaN (n))
        .sort ((a, b) => a - b)
        .map (String); // menu values as strings
    },
    [pageSizeOptions, pageSizeNum]
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{mt: 2}}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(e, v) => onPageChange (v)}
        />
        <Typography variant="body2">
          Старница {page} от {pageCount} ({total} общо)
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2">Елементи на страница:</Typography>
        <Select
          size="small"
          value={pageSize}
          onChange={e => onLimitChange (Number (e.target.value))}
        >
          {pageSizeOptions.map (option => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
}
