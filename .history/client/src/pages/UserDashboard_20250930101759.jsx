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
      setError (error.response?.data?.message || 'Грешка при зареждане на таблото.');
      setLoading (false);
    })
  });

  return (
    <div>
      <h1>
        UserDashboard
      </h1>
    </div>
  );
};

export default UserDashboard;
