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
      <Typography>
        Добре дошъл, администраторе!
      </Typography>
    </Container>
  );
};

export default Dashboard;
