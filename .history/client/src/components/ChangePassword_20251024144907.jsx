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
  IconButton,
  InputAdornment,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState ('');
  const [newPassword, setNewPassword] = useState ('');
  const [confirmNewPassword, setConfirmNewPassword] = useState ('');
  const [showCurrentPassword, setShowCurrentPassword] = useState (false);
  const [showNewPassword, setShowNewPassword] = useState (false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState (false);
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
      setCurrentPassword ('');
      setNewPassword ('');
      setConfirmNewPassword ('');
    } catch (error) {
      setError (error.response?.data?.message || 'Грешка при смяна на паролата.');
      setMessage (null);
    }
  };

  return (
    <Card sx={{maxWidth: 400, margin: '0 auto', mt: 4}}>
      <CardContent>
        <Typography variant='h6' gutterBottom>Смяна на парола</Typography>

        <TextField 
          label='Текуща парола'
          type='password'
          variant='standard'
          fullWidth
          margin='normal'
          value={currentPassword}
          onChange={e => setCurrentPassword (e.target.value)}
          required
          slotProps={{
            input: {
              type: showCurrentPassword ? 'text' : 'password',
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={() => setShowCurrentPassword (!showCurrentPassword)}
                    edge='end'
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />

        <TextField 
          label='Нова парола'
          type='password'
          variant='standard'
          fullWidth
          margin='normal'
          value={newPassword}
          onChange={e => setNewPassword (e.target.value)}
        />

        <TextField 
          label='Потвърди паролата'
          type='password'
          variant='standard'
          fullWidth
          margin='normal'
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword (e.target.value)}
        />

        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={handleSubmit}
          sx={{mt: 2}}
        >
          Смени паролата
        </Button>

        <Snackbar
          open={!!message || !!error}
          autoHideDuration={4000}
          onClose={() => {
            setMessage (null);
            setError (null);
          }}
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        >
          {message ? (
            <Alert severity='success' sx={{width: '100%'}}>
              {message}
            </Alert>
          ) : error ? (
            <Alert severity='error' sx={{width: '100%'}}>
              {error}
            </Alert>
          ) : null}
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
