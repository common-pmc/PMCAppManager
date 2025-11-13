import React, {useState, useEffect, useCallback} from 'react';
import axiosInstance from '../api/axiosInstance'; 
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Typography,
  TextField,
  Stack,
  Box,
  Checkbox,
  Snackbar
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaginationControls from './PaginationControls';

const UserFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState ([]);
  const [successMessage, setSuccessMessage] = useState ('');
  const [localError, setLocalError] = useState (null);

  const {
    data: files = [],
    meta = {},
    loading,
    error: fetchError,
    params,
    setPage,
    setLimit,
    setSearch,
    fetchNow
  } = usePaginatedFetch('/user', { page: 1, limit: 10, search: '' }, [], { debounceMs: 300}, { autoFetch: true });

  // const fetchFiles = useCallback (async () => {
  //   try {
  //     setLoading (true);
  //     const response = await axiosInstance.get ('/user');
  //     setFiles (response.data);
  //   } catch (error) {
  //     setError (error.response?.data?.message || 'Грешка при зареждане на файловете.');
  //   } finally {
  //     setLoading (false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchFiles();
  // }, [fetchFiles]);

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  }

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await axiosInstance.get(`/user/${fileId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'file');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage('Файлът е изтеглен успешно.');

      // Рефреш на списъка с файлове след изтегляне
      fetchNow({ page: params.page, limit: params.limit, search: params.search });
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Грешка при изтегляне на файла.'); 
    }
  };

  const handleDownloadZip = async () => {
    try {
      // Имплементация за изтегляне на ZIP файл с избраните файлове
      const response = await axiosInstance.post('/user/download-zip',
        { ids: selectedFiles },
        { responseType: 'blob' }
      );
      console.log(response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'files.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage('Избраните файлове са изтеглени успешно.');

      setSelectedFiles([]);

      // Рефреш на списъка с файлове след изтегляне
      fetchNow({ page: params.page, limit: params.limit, search: params.search });
    } catch (error) {
      setLocalError(error.response?.data?.message || 'Грешка при изтегляне на ZIP файл.'); 
    }
  }

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setLocalError(null);
  }

  const onPageChange = (page) => {
    setPage(page);
    fetchNow({ page, limit: params.limit, search: params.search });
  };

  const onLimitChange = (limit) => {
    setLimit(limit);
    fetchNow({ page: params.page, limit, search: params.search });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const s = (params.search || '').trim();
      fetchNow({ search: s, page: 1 });
    }
  };

  if(loading) return <CircularProgress />;

  return (
    <Card>
      <CardContent>
        {(fetchError || localError) && <Alert severity="error" sx={{ mb: 2 }}>{fetchError || localError}</Alert>}
        
        <Stack direction="column" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{mb: 2}}>Файлове за изтегляне</Typography>

          <TextField 
            size='small'
            sx={{mb: 3}}
            placeholder="Търси по име на файл..."
            variant="outlined"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </Stack>

        <List>
          {files.length === 0 && <Typography sx={{p: 2}}>Няма налични файлове.</Typography>}
          {files.map(file => (
            <React.Fragment key={file.id}>
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(file.id, file.originalname)}
                    >
                      Свали
                    </Button>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Checkbox
                    edge="start"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                  />
                </ListItemAvatar>
                <ListItemAvatar>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={file.name}
                  secondary={
                    <React.Fragment>
                      <Box component='span'>
                        {file.description ? file.description : 'Няма описание'}
                      </Box>
                      <Box component='span' sx={{ color: 'text.secondary', fontSize: 12, ml: 2}}>
                        {file.lastDownloadedBy ? `Последно изтеглен от ${file.lastDownloadedBy} на ${new Date (file.lastDownloadedAt || file.updatedAt).toLocaleString()}` : 'Все още не е изтеглян'}
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        {selectedFiles.length > 0 && (
          <Box sx={{mt: 2, textAlign: 'center'}}>
            <Button
              variant="contained"
              color='primary'
              startIcon={<DownloadIcon />}
              onClick={handleDownloadZip}
            >
              Свали избраните
            </Button>
          </Box>
        )}

        <Snackbar
          open={!!successMessage || !!fetchError || !!localError}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          {successMessage ? (
            <Alert
              severity="success"
              sx={{width: '100%'}}
              onClose={handleCloseSnackbar}
            >
              {successMessage}
            </Alert>
          ) : null}
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UserFiles;
