import React from 'react';
import {Button} from '@mui/material';
import {useLogout} from '../utils/auth';

const LogoutButton = ({redirectTo = '/', ...props}) => {
  const logout = useLogout (redirectTo);

  return (
    <div>
      <Button onClick={logout} color="inherit" variant="outlined" {...props}>
        Изход
      </Button>
    </div>
  );
};

export default LogoutButton;
