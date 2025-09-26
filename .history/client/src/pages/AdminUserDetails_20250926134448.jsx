import React, {useState, useEffect, useCallback} from 'react';
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
  const [user, setUser] = useState (null);
  const [downloads, setDownloads] = useState ([]);
  const [confirmOpen, setConfirmOpen] = useState (false);
  const [actionLoading, setActionLoading] = useState (false);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const {id} = useParams ();
  const navigate = useNavigate ();

  const fetchData = useCallback(async () => {
    try {
      setLoading (true);
      const response = await axiosInstance.get (`/admin/users/${id}`);
      setUser (response.data.user);
      setDownloads (response.data.downloads || []);
      setLoading (false);
    } catch (error) {
      console.error ('Грешка при извличане на детайли за потребителя.', error);
      setError (
        error.response?.data?.message ||
          'Грешка при извличане на детайли за потребителя.'
      );
      setLoading (false);
    }
  }, [id]);

  useEffect (() => {
    fetchData ();
  }, [fetchData]);

  const handleToggleActive = async () => {
    try {
      setActionLoading (true);
      const response = await axiosInstance.patch (
        `/admin/users/${id}/toggle-active`
      );
      setUser (prev => ({...prev, isActive: response.data.isActive}));
    } catch (error) {
      console.error ('Грешка при промяна на статуса на потребителя.', error);
      setError (
        error.response?.data?.message ||
          'Грешка при промяна на статуса на потребителя.'
      ); 
    } finally {
      setActionLoading (false);
    }
  }

  const handleDelete = async () => {
    if(!window.confirm('Сигурни ли сте, че искате да изтриете този потребител?')) return;

    try {
      setActionLoading(true);
      await axiosInstance.delete(`/admin/users/${id}`);
      alert('Потребителят е изтрит успешно.');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Грешка при изтриване на потребителя.', error);
      setError(
        error.response?.data?.message ||
        'Грешка при изтриване на потребителя.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadFile = async (fileId, originalName) => {
    try {
      const response = await axiosInstance.get(`/files/${fileId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName || 'file';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Грешка при изтегляне на файла.', error);
      setError(
        error.response?.data?.message ||
        'Грешка при изтегляне на файла.'
      ); 
    }
  }

  if (loading) return <Container><Typography>Зареждане...</Typography></Container>;
  if (error)  return <Container><Typography color="error">{error}</Typography></Container>;
  if (!user) return <Container><Typography>Потребителят не е намерен.</Typography></Container>;

  return (
      <Container maxWidth="lg" sx={{py: 4}}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')}>
            Назад към потребители
          </Button>
          <Typography variant='f5' sx={{alignSelf: 'center'}}>{user.email}</Typography>
          <Chip 
            label={user.isActive ? 'Активен' : 'Деактивиран'} 
            color={user.isActive ? 'success' : 'error'} 
            icon={user.isActive ? <CheckCircleIcon /> : <BlockIcon />} 
          />
        </Stack>
    </Container>
  );
};

export default AdminUserDetails;
