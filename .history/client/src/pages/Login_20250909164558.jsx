import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Box, Button, Paper, TextField, Typography, Alert} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState ({
    email: '',
    password: '',
  });
  const [error, setError] = useState ('');

  const navigate = useNavigate ();

  const handleLogin = async e => {
    e.preventDefault ();
    setError (''); // Reset error state

    try {
      const res = await axios.post ('/api/auth/login', formData);

      const token = res.data.accessToken;
      localStorage.setItem ('token', token); // Store token in localStorage

      console.log ('Влизането е успешно: Token:', token);
      // Redirect or update UI as needed
      navigate ('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error ('Login error:', error);
      setError ('Грешка при влизане. Моля, опитайте отново.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 2,
        }}
        component="form"
        onSubmit={handleLogin}
      >
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Вход в системата
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
