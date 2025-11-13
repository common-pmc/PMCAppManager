import React from 'react';
import {Stack, Pagination, Select, MenuItem, Typography} from '@mui/material';

export default function PaginationControls({
  meta = {},
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 20, 50],
}) {
  if (!meta) return null;

  const {
    page = 1,
    pageCount = 1,
    pageSize = meta.pageSize || 10,
    total = 0,
  } = meta;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{mt: 2}}
    >
      <Stack>
        jhfmhhj
      </Stack>
    </Stack>
  );
}
