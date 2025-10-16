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
    } catch (error) {
      // 
    }
  };

  return (
    <div>
      <h1>UserFiles</h1>
    </div>
  );
};

export default UserFiles;
