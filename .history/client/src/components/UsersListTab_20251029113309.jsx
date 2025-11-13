import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import paginate from '../../../utils/paginate';
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
  Button,
  Stack,
  Alert,
  debounce,
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
  } = usePaginatedFetch ('/users', {limit: 100}, [], {debounceMs: 300});

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" sx={{mb: 4}} fontWeight="bold">
        Списък с потребителите
      </Typography>

      <TextField
        size="small"
        label="Търсене по имейл"
        variant="outlined"
        value={params.search}
        onChange={e => setSearch (e.target.value)}
        sx={{mb: 2, width: '300px'}}
      />

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

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
    </Container>
  );
};

export default UsersListTab;
