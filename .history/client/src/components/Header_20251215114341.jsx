import React from 'react';
import {AppBar, Toolbar, Typography, Box} from '@mui/material';
import LogoutButton from './LogoutButton';
import {getNameFromEmail} from '../utils/user';

const Header = () => {
  const rawUser = localStorage.getItem ('user');
  const user = rawUser ? JSON.parse (rawUser) : null;

  const userName = user?.email ? getNameFromEmail (user.email) : 'Гост';

  return (
    <AppBar position="static" elevation={3} sx={{backgroundColor: 'gray', mb: 4}}>
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant='h6' sx={{fontWeight: 600}}>
          PMC Manager
        </Typography>

        {userName && (
          <Typography variant='h4' sx={{flexGrow: 1, textAlign: 'center'}}>
            Добре дошъл, {userName}!
          </Typography>
        )}

        <Box>
          <LogoutButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
