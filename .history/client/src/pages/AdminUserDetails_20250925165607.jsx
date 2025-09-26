import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  down,
} from '../../../.history/database/migrations/20250806134145-add-userId-to-file_20250806165048';
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
  const [user, setUser] = useState (null);
  const [downloads, setDownloads] = useState ([]);
  const [confirmOpen, setConfirmOpen] = useState (false);
  const [actionLoading, setActionLoading] = useState (false);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const {id} = useParams ();
  const navigate = useNavigate ();

  return (
    <div>
      <h1>AdminUserDetails</h1>
    </div>
  );
};

export default AdminUserDetails;
