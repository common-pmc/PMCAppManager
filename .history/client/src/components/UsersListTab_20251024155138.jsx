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
        hfghdngd
      </Typography>
    </Container>
  );
};

export default UsersListTab;
