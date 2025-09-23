import React, {useEffect, useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Alert,
  Chip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleONIcon from '@mui/icons-material/ToggleOn';

const Dashboard = () => {
  const [users, setUsers] = useState ([]);
  const [error, setError] = useState ('');
  const navigate = useNavigate ();

  useEffect (() => {
    axiosInstance
      .get ('/users')
      .then (res => setUsers (res.data))
      .catch (err => {
        console.error ('Error:', err);
        setError ('Грешка при зареждане на потребителите');
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Typography variant="h4" sx={{mb: 4}} fontWeight="bold">
        Добре дошъл, администраторе!
      </Typography>

      {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

      <Paper sx={{mb: 4}}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имейл</TableCell>
                <TableCell>Фирма</TableCell>
                <TableCell>Отдел</TableCell>
                <TableCell align="center"><b>Админ</b></TableCell>
                <TableCell align="center">Действия</TableCell>
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
                    {user.isAdmin &&
                      <Chip label="Да" color="primary" size="small" />}
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

                      <Button
                        variant="contained"
                        color="danger"
                        size="small"
                        startIcon={<DeleteIcon />}
                      >
                        Изтрий
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Stack direction="row" spacing={2} sx={{mb: 2}}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate ('/admin/register')}
        >
          Регистрирай нов потребител
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate ('/admin/upload')}
        >
          Качи файл
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate ('/admin/files')}
        >
          Списък с файлове
        </Button>

        <Button>
          Филтрирай файлове
        </Button>
      </Stack>
    </Container>
  );
};

export default Dashboard;
