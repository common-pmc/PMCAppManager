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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';

const AdminUserDetails = () => {
  const [users, setUsers] = useState ([]);

  return (
    <div>
      <h1>AdminUserDetails</h1>
    </div>
  );
};

export default AdminUserDetails;
