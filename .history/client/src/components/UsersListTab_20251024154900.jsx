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

  return <div>UsersListTab</div>;
};

export default UsersListTab;
