import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const AdminUserDetails = () => {
  const [users, setUsers] = useState ([]);

  return (
    <div>
      <h1>AdminUserDetails</h1>
    </div>
  );
};

export default AdminUserDetails;
