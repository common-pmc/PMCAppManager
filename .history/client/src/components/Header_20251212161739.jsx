import React from 'react';
import {AppBar, Toolbar, Typography, Box} from '@mui/material';
import LogoutButton from './LogoutButton';
import {getNameFromEmail} from '../utils/user';

const Header = () => {
  const rawUser = localStorage.getItem ('user');
  const user = rawUser ? JSON.parse (rawUser) : null;
  const userName = user ? getNameFromEmail (user.email) : 'Гост';

  return (
    <div className="text-3xl font-bold mb-4 bg-gray-400">
      <h1>Header</h1>
    </div>
  );
};

export default Header;
