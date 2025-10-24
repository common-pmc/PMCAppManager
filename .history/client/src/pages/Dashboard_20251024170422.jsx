import React, {useState} from 'react';
import {Box, Tabs, Tab, Container, Typography} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
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
      {value === index &&
        <Box sx={{p: 3}}>
          {children}
        </Box>}
    </div>
  );
}

function allyProps (index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [tab, setTab] = useState (0);

  const handleTabChange = (e, newValue) => {
    setTab (newValue);
  };

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Typography>
        Администраторски панел
      </Typography>

      <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="Admin tabs">
          <Tab
            icon={<GroupIcon />}
            iconPosition="start"
            {...allyProps (0)}
            label="Потребители"
          />

          <Tab
            icon={<BuildIcon />}
            iconPosition="start"
            {...allyProps (1)}
            label="Административни действия"
          />

          <Tab
            icon={<VpnKeyIcon />}
            iconPosition="start"
            {...allyProps (2)}
            label="Промяна на паролата"
          />
        </Tabs>
      </Box>
    </Container>
  );
};

export default Dashboard;
