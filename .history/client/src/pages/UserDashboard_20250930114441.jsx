import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  Typography,
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
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const UserDashboard = () => {
  const [status, setStatus] = useState (null);
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  useEffect (() => {
    axiosInstance.get ('/user/dashboard').then (res => {
      setStatus (res.data.status);
      setFiles (res.data.files);
      setLoading (false);
    }).catch (error => {
      setError (error.response?.data?.message || 'Грешка при зареждане на данните.');
      setLoading (false);
    })
  }, []);

  const handleDownload = fileId => {
    axiosInstance.get (`/user/download/${fileId}`, { responseType: 'blob' })
      .then(res => {
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filename.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        setError (error.response?.data?.message || 'Грешка при изтегляне на файла.');
      })
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Моят дашборд
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ggh
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDashboard;
