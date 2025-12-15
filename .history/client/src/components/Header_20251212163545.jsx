import React from 'react';
import {AppBar, Toolbar, Typography, Box} from '@mui/material';
import LogoutButton from './LogoutButton';
import {getNameFromEmail} from '../utils/user';

const Header = () => {
  const rawUser = localStorage.getItem ('user');
  const user = rawUser ? JSON.parse (rawUser) : null;

  const userName = user?.email ? getNameFromEmail (user.email) : 'Гост';

  return (
    <AppBar position="static" elevation={3} sx={{backgroundColor: 'gray'}}>
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant='h6' sx={{fontWeight: 600}}>
          PMC Manager
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
