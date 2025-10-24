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
  const [message, setMessage] = useState (null);
  const [error, setError] = useState (null);

  const handleSubmit = async e => {
    e.preventDefault ();
    setMessage (null);
    setError (null);

    try {
      const token = localStorage.getItem ('token');
      const response = await axiosInstance.post (
        '/auth/change-password',
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage (response.data.message);
    } catch (error) {
      //
    }
  };

  return (
    <div>
      <h1>ChangePassword</h1>
    </div>
  );
};

export default ChangePassword;
