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

const UserDashboard = () => {
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  useEffect (() => {});

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default UserDashboard;
