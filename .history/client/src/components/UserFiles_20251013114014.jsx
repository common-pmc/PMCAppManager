import React, {useState, useEffect, useCallback} from 'react';
import axiosInstance from '../api/axiosInstance';
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
  Stack,
  Box,
  Checkbox
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';

const UserFiles = () => {
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);
  const [selectedFiles, setSelectedFiles] = useState ([]);

  const fetchFiles = useCallback (async () => {
    try {
      setLoading (true);
      const response = await axiosInstance.get ('/user');
      setFiles (response.data);
    } catch (error) {
      setError (error.response?.data?.message || 'Грешка при зареждане на файловете.');
    } finally {
      setLoading (false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleSelectFile = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  }

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axiosInstance.get(`/files/${fileId}/download-`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'file');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Рефреш на списъка с файлове след изтегляне
      fetchFiles();
    } catch (error) {
      setError(error.response?.data?.message || 'Грешка при изтегляне на файла.'); 
    }
  };

  const handleDownloadZip = async () => {
    try {
      // Имплементация за изтегляне на ZIP файл с избраните файлове
      const response = await axiosInstance.post('/user/download-zip',
        { fileIds: selectedFiles },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'files.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Рефреш на списъка с файлове след изтегляне
      fetchFiles();
    } catch (error) {
      setError(error.response?.data?.message || 'Грешка при изтегляне на ZIP файл.'); 
    }
  }

  if(loading) return <CircularProgress />;

  return (
    <Card>
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography>Файлове за изтегляне</Typography>

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
                      onClick={() => handleDownload(file.id, file.name)}
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
                      <Box component='span' sx={{ color: 'text.secondary', fontSize: 12}}>
                        {file.downloadedBy ? `Последно изтеглен от ${file.lastDownloadedBy.email} на ${new Date (file.lastDownloadedAt || file.updatedAt).toLocaleString()}` : 'Все още не е изтеглян'}
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
      </CardContent>
    </Card>
  );
};

export default UserFiles;
