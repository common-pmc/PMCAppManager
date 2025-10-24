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
      //
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
