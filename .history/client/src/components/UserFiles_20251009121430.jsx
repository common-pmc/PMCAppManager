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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';

const UserFiles = () => {
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

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

  if(loading) return <CircularProgress />;

  return (
    <Card>
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Typography>Файлове за изтегляне</Typography>

        <List>
          {files.length === 0 && <Typography>Няма налични файлове.</Typography>}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserFiles;
