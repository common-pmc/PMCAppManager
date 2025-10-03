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
  };

  return (
    <div>
      <h1>
        UserDashboard
      </h1>
    </div>
  );
};

export default UserDashboard;
