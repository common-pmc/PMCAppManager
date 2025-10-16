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
    }
  }, []);

  return (
    <div>
      <h1>UserFiles</h1>
    </div>
  );
};

export default UserFiles;
