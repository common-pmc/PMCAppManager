import React, {useState, useEffect, useCallback} from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentIcon from '@mui/icons-material/Assignment';

const UserDashboard = () => {
  const [files, setFiles] = useState ([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const fetchFiles = useCallback (async () => {
    try {
      const response = await axiosInstance.get ('/user');
      setFiles (response.data);
      setLoading (false);
    } catch (error) {
      setError (
        error.response?.data?.message ||
          'Грешка при зареждане на файловете. Моля опитайте по-късно.'
      );
      setLoading (false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axiosInstance.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Грешка при сваляне на файла. Моля опитайте по-късно.'
      ); 
    }
  }

  if(loading) return <CircularProgress />;

  return (
      <Box sx={{p: 3}}>
        <Typography variant='h4' gutterBottom>
          Моят дашборд
        </Typography>

        {error && <Alert severity='error' sx={{mb: 2}}>{error}</Alert>}

        <Typography variant='h6' gutterBottom>
          Файлове за изтегляне:
        </Typography>

        <Card>
        <CardContent>
          <List>
            {files.length === 0 && (
              <Typography sx={{ p: 2 }}>
                Няма налични файлове за изтегляне.
              </Typography>
            )}
            {files.map((file) => (
              <React.Fragment key={file.id}>
                <ListItem
                  secondaryAction={
                    <IconButton 
                      color="primary" 
                      onClick={() => handleDownload(file.fileId, file.filename)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={file.filename}
                    secondary={
                      <>
                        <br />
                        {file.lastDownloadedBy
                          ? `Последно изтеглен от ${file.lastDownloadedBy} на ${new Date(
                              file.lastDownloadedAt
                            ).toLocaleDateString()}`
                          : "Файлът още не е изтеглян."}
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
      </Box>
  );
};

export default UserDashboard;
