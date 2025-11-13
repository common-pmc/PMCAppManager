import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PaginationControls from '../components/PaginationControls';

const AdminUserDetails = () => {
  const [user, setUser] = useState (null);
  // const [downloads, setDownloads] = useState ([]);
  const [actionLoading, setActionLoading] = useState (false);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const {id} = useParams ();
  const navigate = useNavigate ();

  // За downloads използваме usePaginatedFetch hook
  const {
    data: downloads,
    loading: downloadsLoading,
    error: downloadsError,
    meta,
    params,
    setLimit,
    setSearch,
    setPage,
    fetchNow,
  } = usePaginatedFetch(`/admin/users/${id}`, {page: 1, limit: 10, search: ''}, [id], {
    debounceMs: 300,
  });

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
          <Button variant='outlined' startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')}>
            Назад към потребители
          </Button>
          <Chip 
            label={user.isActive ? 'Активен' : 'Деактивиран'} 
            color={user.isActive ? 'success' : 'error'} 
            icon={user.isActive ? <CheckCircleIcon /> : <BlockIcon />} 
          />          
        </Stack>
        <Stack>
          <Typography variant='h4' element='h4' sx={{alignSelf: 'center', mb: 3}}>
            Детайли за {user.email}
          </Typography>         
        </Stack>

        <Paper sx={{p: 2, mb: 3}}>
          <Stack direction="row" spacing={2} justifyContent='space-between' alignItems='center'>
            <Stack>
              <Typography variant='subtitle1'><b>Фирма:</b> {user.company?.name}</Typography>
              <Typography variant='subtitle1'><b>Отдел:</b> {user.department?.name}</Typography>
              <Typography variant='subtitle2' color='secondary'><b>Създаден:</b> {new Date(user.createdAt).toLocaleString()}</Typography>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant={user.isActive ? 'outlined' : 'contained'}
                color={user.isActive ? 'warning' : 'success'}
                startIcon={user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                onClick={handleToggleActive}
                disabled={actionLoading}
              >
                {user.isActive ? 'Деактивирай' : 'Активирай'}
              </Button>

              <Button
                variant='contained'
                color='error'
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={actionLoading}
              >
                Изтрий потребителя
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Typography variant='h6' sx={{mb: 2}}>Файлове, които потребителят е изтеглил</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Име на файла</TableCell>
                <TableCell>Изтеглен на</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {downloads.length === 0 && (
                  <TableCell colSpan={6} align="center">
                    Потребителят все още не е изтеглил файлове.
                  </TableCell>
                )}
              </TableRow>
              {downloads.map((download) => (
                <TableRow key={download.id}>
                  <TableCell>{download.filename}</TableCell>
                  <TableCell>{new Date(download.downloadedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </Container>
  );
};

export default AdminUserDetails;
