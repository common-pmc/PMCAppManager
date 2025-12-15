import React from 'react';
import {AppBar, Toolbar, Typography, Box} from '@mui/material';
import LogoutButton from './LogoutButton';
import {getNameFromEmail} from '../utils/user';
import PMCLogo from '../assets/PMCLogo.svg';

const Header = () => {
  const rawUser = localStorage.getItem ('user');
  const user = rawUser ? JSON.parse (rawUser) : null;

  const userName = user?.email ? getNameFromEmail (user.email) : 'Гост';

  return (
    <AppBar position="static" elevation={3} sx={{backgroundColor: 'gray', mb: 4}}>
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        <img src={PMCLogo} alt="PMC Logo" style={{height: '80px'}} />

        {userName && (
          <Typography variant='h5' sx={{flexGrow: 1, textAlign: 'center'}}>
            Добре дошли, {userName.charAt (0).toUpperCase () + userName.slice (1)}!
          </Typography>
        )}

        <Box>
          <LogoutButton 
            sx={{borderColor: 'white', color: 'white', 
            hover: {borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)'}}}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
