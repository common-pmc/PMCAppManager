import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
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
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const UsersListTab = () => {
  const [users, setUsers] = useState ([]);
  const [error, setError] = useState (null);

  const navigate = useNavigate ();

  useEffect (() => {
    axiosInstance
      .get ('/users')
      .then (res => setUsers (res.data))
      .catch (err => {
        console.error ('Error fetching users:', err);
        setError ('Грешка при зареждане на потребителите');
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" sx={{mb: 4}} fontWeight="bold">
        Списък с потребителите
      </Typography>

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
