import React from 'react';
import {useNavigate} from 'react-router-dom';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PaginationControls from './PaginationControls';

const UsersListTab = () => {
  const navigate = useNavigate ();

  const {
    data: users,
    meta,
    loading,
    error,
    params,
    setPage,
    setLimit,
    setSearch,
    fetchNow,
  } = usePaginatedFetch ('/users', {page: 1, limit: 100}, [], {
    debounceMs: 300,
  });

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" sx={{mb: 4}} fontWeight="bold">
        Списък с потребителите
      </Typography>

      <TextField
        size="small"
        placeholder="Търси по имейл..."
        value={params.search || ''}
        onChange={e => setSearch (e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            // force fetch with the current search value (trimmed)
            const s = (e.target.value || '').trim ();
            setSearch (s); // keep state in sync
            fetchNow ({search: s, page: 1});
          }
        }}
        sx={{mb: 2, minWidth: 300}}
      />

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
      {loading && <CircularProgress sx={{mb: 2}} />}

      <Paper sx={{mb: 4}}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Имейл</b></TableCell>
                <TableCell><b>Фирма</b></TableCell>
                <TableCell><b>Отдел</b></TableCell>
                <TableCell align="center" />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map (user => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.Company && user.Company.companyName
                      ? user.Company.companyName
                      : <Typography
                          variant="body2"
                          color="text.secondary"
                          fontStyle="italic"
                        >
                          Няма фирма
                        </Typography>}
                  </TableCell>
                  <TableCell>
                    {user.Department && user.Department.departmentName
                      ? user.Department.departmentName
                      : ''}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="info"
                        startIcon={<InfoIcon />}
                        onClick={() => navigate (`/admin/user/${user.id}`)}
                      >
                        Детайли
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PaginationControls
        meta={{
          page: meta.page || params.page,
          pageCount: meta.pageCount || 1,
          pageSize: meta.pageSize || params.limit,
          total: meta.total || 0,
        }}
        onPageChange={p => {
          fetchNow ({page: p, limit: params.limit, search: params.search});
        }}
        onLimitChange={l => {
          fetchNow ({limit: l, page: 1, search: params.search});
        }}
      />
    </Container>
  );
};

export default UsersListTab;
