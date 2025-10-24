import React, {useState} from 'react';
import {Box, Tabs, Tab, Container, Typography} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import UsersListTab from '../components/UsersListTab';
import AdminActionsTab from '../components/AdminActionsTab';
import ChangePassword from '../components/ChangePassword';

function TabPanel (props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      dgdgf
    </div>
  );
}

const Dashboard = () => {
  const [tab, setTab] = useState (0);

  return <div>Dashboard</div>;
};

export default Dashboard;
