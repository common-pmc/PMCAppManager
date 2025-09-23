import React, {useEffect, useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';
import {
  Container,
  Box,
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
                <TableCell><b>Админ</b></TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Dashboard;
