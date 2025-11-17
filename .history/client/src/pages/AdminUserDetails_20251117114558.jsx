import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import axiosInstance from '../api/axiosInstance';
import {
  Container, Paper, Typography, Stack, Button, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  IconButton, TextField, CircularProgress, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import PaginationControls from '../components/PaginationControls';

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // user ще идва от hook.extra.user (ако бекенд връща user)
  const [user, setUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // usePaginatedFetch използва същия endpoint, който връща { user, downloads, meta }
  const {
    data: downloads,
    meta,
    loading: downloadsLoading,
    error: downloadsError,
    params,
    setLimit,
    setSearch,
    setPage,
    fetchNow,
    extra, // <-- тук е raw response.data от бекенда (вкл. user)
  } = usePaginatedFetch(`/admin/users/${id}`, { page: 1, limit: 10, search: '' }, [id], {
    debounceMs: 300,
  });

  console.log('[AdminUserDetails] hook downloads: ', downloads);
  console.log('[AdminUserDetails] hook extra: ', extra);
  console.log('[AdminUserDetails] filenames: ', downloads?.map(d => d.filename));

  // Вземаме user от extra (ако е наличен). Това предотвратява отделен axios.get
  useEffect(() => {
    if (extra && extra.user) {
      setUser(extra.user);
    }
  }, [extra]);

  // Ако бекенд не връща user (рядко), fallback — можем да го заредим отделно:
  useEffect(() => {
    const controller = new AbortController();

    async function loadUserFallback() {
      if (user) return; // има го вече, няма нужда от заявка
      try {
        const res = await axiosInstance.get(`/admin/users/${id}`, { signal: controller.signal });
        if (res.data?.user) setUser(res.data.user);
      } catch (err) {
        // Игнорира отменени заявки и не записва грешка в UI
        if (err.name === 'CanceledError' || err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
        console.error('fallback user fetch error', err);
      }
    }
    loadUserFallback();

    // Cleanup функция
    return () => { controller.abort(); };
  }, [id, user]);

  const handleToggleActive = async () => {
    try {
      setActionLoading(true);
      const res = await axiosInstance.patch(`/admin/users/${id}/toggle-active`);
      if (res.data?.isActive !== undefined) {
        setUser(prev => ({ ...prev, isActive: res.data.isActive }));
      } else {
        // презареждаме (fetchNow ще обнови и extra/downloads) ако няма директен отговор
        await fetchNow({ page: params.page, limit: params.limit, search: params.search });
      }
    } catch (err) {
      console.error(err);
      setLocalError(err.response?.data?.message || 'Грешка при промяна на статуса.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този потребител?')) return;
    try {
      setActionLoading(true);
      await axiosInstance.delete(`/admin/users/${id}`);
      alert('Потребителят е изтрит успешно.');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setLocalError(err.response?.data?.message || 'Грешка при изтриване.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadFile = async (fileId, originalName) => {
    if (!fileId) {
      alert('Файлът не е наличен.');
      return;
    }
    try {
      const response = await axiosInstance.get(`/files/${fileId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName || 'file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setLocalError(err.response?.data?.message || 'Грешка при свалянето на файла.');
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    fetchNow({ page, limit: params.limit, search: params.search });
  }
  const handleLimitChange = (limit) => {
    setLimit(limit);
    fetchNow({ page: params.page, limit, search: params.search });
  };

  const handleSearch = e => {
    if (e.key === 'Enter') {
      const s = e.target.value.trim ();
      fetchNow ({search: s, page: 1});
    }
  };

  const isLoading = downloadsLoading && !user;
  const error = localError || downloadsError;

  if (isLoading) {
    return (
      <Container>
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Зареждане...</Typography>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Typography sx={{ my: 3 }}>Потребителят не е намерен.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/dashboard')}>
          Назад към потребители
        </Button>
        <Chip
          label={user.isActive ? 'Активен' : 'Деактивиран'}
          color={user.isActive ? 'success' : 'error'}
          icon={user.isActive ? <CheckCircleIcon /> : <BlockIcon />}
        />
      </Stack>

      <Typography variant="h4" sx={{ alignSelf: 'center', mb: 3 }}>Детайли за {user.email}</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1"><b>Фирма:</b> {user.company?.name || '-'}</Typography>
            <Typography variant="subtitle1"><b>Отдел:</b> {user.department?.name || '-'}</Typography>
            <Typography variant="subtitle2" color="secondary"><b>Създаден:</b> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</Typography>
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
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={actionLoading}
            >
              Изтрий потребителя
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Stack direction="column" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" sx={{mb: 4}}>Файлове, които потребителят е изтеглил</Typography>
        <TextField
          size="small"
          sx={{ mb: 3, radius: 15}}
          placeholder="Търси по име на файл..."
          value={params.search || ''}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch} 
        />
      </Stack>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Име на файла</TableCell>
                <TableCell>Изтеглен на</TableCell>
                <TableCell align="center">Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(!downloads || downloads.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    Потребителят все още не е изтеглил файлове.
                  </TableCell>
                </TableRow>
              ) : downloads.map(d => (
                <TableRow key={d.id}>
                  <TableCell>{d.filename || '(липсва)'}</TableCell>
                  <TableCell>{d.downloadedAt ? new Date(d.downloadedAt).toLocaleString() : '-'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleDownloadFile(d.fileId, d.filename)} disabled={!d.fileId}>
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Stack sx={{ mt: 2 }}>
        <PaginationControls
          meta={{
            page: Number(params.page) || Number(meta.page) || 1,
            pageCount: Number(meta.pageCount) || 1,
            pageSize: Number(meta.pageSize) || Number(params.limit) || 10,
            total: Number(meta.total) || 0,
          }}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </Stack>
    </Container>
  );
};

export default AdminUserDetails;
