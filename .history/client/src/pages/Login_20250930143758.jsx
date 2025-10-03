import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState ({
    email: '',
    password: '',
  });
  const [error, setError] = useState ('');
  const [showPassword, setShowPassword] = useState (false);

  const navigate = useNavigate ();

  const handleLogin = async e => {
    e.preventDefault ();
    setError (''); // Reset error state

    try {
      const res = await axios.post ('/api/auth/login', formData);

      const token = res.data.accessToken;
      localStorage.setItem ('token', token); // Store token in localStorage

      const payload = jwtDecode (token);
      console.log ('Влизането е успешно: Token:', token, 'Payload:', payload);
      // Redirect to dashboard
      if (payload.isAdmin) {
        navigate ('/admin/dashboard');
      } else {
        navigate ('/user/dashboard');
      }
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
        backgroundColor: '#ffffff',
        padding: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 4,
        }}
        component="form"
        onSubmit={handleLogin}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          align="center"
          fontWeight="bold"
        >
          Вход в системата
        </Typography>

        <TextField
          label="Имейл"
          type="email"
          value={formData.email}
          onChange={e => setFormData ({...formData, email: e.target.value})}
          fullWidth
          margin="normal"
          variant="standard"
          required
        />

        <TextField
          label="Парола"
          type="password"
          value={formData.password}
          onChange={e => setFormData ({...formData, password: e.target.value})}
          fullWidth
          margin="normal"
          variant="standard"
          required
          slotProps={{
            input: {
              type: showPassword ? 'text' : 'password',
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword (!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {error &&
          <Alert severity="error" sx={{mt: 2}}>
            {error}
          </Alert>}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          endIcon={<LoginIcon />}
          sx={{mt: 3}}
        >
          Вход
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
