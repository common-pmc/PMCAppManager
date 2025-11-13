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
    setLimit,
    setSearch,
    fetchNow,
  } = usePaginatedFetch ('/users', {page: 1, limit: 10}, [], {
    debounceMs: 300,
  });

  const handleSearch = e => {
    if (e.key === 'Enter') {
      const s = e.target.value.trim ();
      fetchNow ({search: s, page: 1});
    }
  };

  const handlePageChange = page => {
    fetchNow ({page, limit: params.limit, search: params.search});
  };

  const handleLimitChange = limit => {
    fetchNow ({limit, page: 1, search: params.search});
  };

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" sx={{mb: 4}} fontWeight="bold">
        Списък с потребителите
      </Typography>

      <TextField
        label="Търси по имейл..."
        fullWidth
        sx={{mb: 3}}
        value={params.search || ''}
        onChange={e => fetchNow ({search: e.target.value.trim (), page: 1})}
        onKeyDown={handleSearch}
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
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </Container>
  );
};

export default UsersListTab;
