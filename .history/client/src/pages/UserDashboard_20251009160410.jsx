import React, {useState} from 'react';
import {Box, Tabs, Tab, Container, Typography} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import UserFiles from '../components/UserFiles';
import ChangePassword from '../components/ChangePassword';

function tabPanel (props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index &&
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>}
    </div>
  );
}

function a11yProps (index) {
  return {
    id: `user-tab-${index}`,
    'aria-controls': `user-tabpanel-${index}`,
  };
}

const UserDashboard = () => {
  const [tab, setTab] = useState (0);

  const handleTabChange = () => {};

  return (
    <div>
      <h1>UserDashboard</h1>
    </div>
  );
};

export default UserDashboard;
