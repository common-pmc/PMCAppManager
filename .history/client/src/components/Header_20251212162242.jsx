import React from 'react';
import {AppBar, Toolbar, Typography, Box} from '@mui/material';
import LogoutButton from './LogoutButton';
import {getNameFromEmail} from '../utils/user';

const Header = () => {
  const rawUser = localStorage.getItem ('user');
  const user = rawUser ? JSON.parse (rawUser) : null;

  const userName = user?.email ? getNameFromEmail (user.email) : 'Гост';

  return (
    <AppBar position="static" elevation={3} color="grey">
      <h1>Header</h1>
    </AppBar>
  );
};

export default Header;
