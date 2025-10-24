import React, {useState} from 'react';
import {Box, Tabs, Tab, Container, Typography} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import UsersListTab from '../components/UsersListTab';
import AdminActionsTab from '../components/AdminActionsTab';
import ChangePassword from '../components/ChangePassword';

const Dashboard = () => {
  const [tab, setTab] = useState (0);

  return <div>Dashboard</div>;
};

export default Dashboard;
