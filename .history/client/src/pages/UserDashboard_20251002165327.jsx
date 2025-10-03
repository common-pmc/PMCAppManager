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
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AssignmentIcon from '@mui/icons-material/Assignment';

const UserDashboard = () => {
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const fetchFiles = useCallback (async () => {
    try {
      const response = await axiosInstance.get ('/users/dashboard');
      setFiles (response.data.files);
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
                    <Button
                      variant="contained"
                      startIcon={<CloudDownloadIcon />}
                      onClick={() => handleDownload(file.id, file.filename)}
                    >
                      Свали
                    </Button>
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
                        {`Размер: ${(file.size / 1024).toFixed(2)} KB | 
                        Създаден: ${new Date(file.createdAt).toLocaleDateString()}`}{" "}
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
