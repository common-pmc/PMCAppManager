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

  const handleTabChange = (e, newValue) => {
    setTab (newValue);
  };

  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Typography>
        Моят дашборд
      </Typography>

      <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="User tabs">
          <Tab
            icon={<FolderIcon />}
            iconPosition="start"
            {...a11yProps (0)}
            label="Файлове"
          />
          <Tab
            icon={<VpnKeyIcon />}
            iconPosition="start"
            {...a11yProps (1)}
            label="Промяна на паролата"
          />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <UserFiles />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ChangePassword />
      </TabPanel>
    </Container>
  );
};

export default UserDashboard;
