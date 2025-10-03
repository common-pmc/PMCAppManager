import React, {useState, useEffect, useCallback} from 'react';
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

const UserDashboard = () => {
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const fetchFiles = useCallback (async () => {
    try {
      const response = await axiosInstance.get ('/user/dashboard');
      setFiles (response.data.files);
      setLoading (false);
    } catch (error) {
      setError (
        error.response?.data?.message ||
          'Грешка при зареждане на файловете. Моля опитайте по-късно.'
      );
      setLoading (false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axiosInstance.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    } catch (error) {
      // 
    }
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default UserDashboard;
