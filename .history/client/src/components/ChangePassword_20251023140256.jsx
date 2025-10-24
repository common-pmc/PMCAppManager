import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState ('');
  const [newPassword, setNewPassword] = useState ('');
  const [confirmNewPassword, setConfirmNewPassword] = useState ('');
  const [error, setError] = useState ('');
  const [success, setSuccess] = useState (false);

  return (
    <div>
      <h1>ChangePassword</h1>
    </div>
  );
};

export default ChangePassword;
