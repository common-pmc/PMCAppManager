import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 
import usePaginatedFetch from '../hooks/usePaginatedFetch';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaginationControls from '../components/PaginationControls';

const FileList = () => {
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const navigate = useNavigate ();

  const fetchFiles = async () => {
    try {
      setLoading (true);
      const response = await axiosInstance.get ('/admin/files', {
        withCredentials: true,
      });
      setFiles (response.data);
      setLoading (false);
    } catch (error) {
      console.error ('Грешка при зареждане на файловете:', error);
      setError ('Неуспешно зареждане на файловете. Моля опитайте по-късно.');
      setLoading (false);
    }
  };

  useEffect (() => {
    fetchFiles ();
  }, []);

  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await axiosInstance.get (`/files/${fileId}/download`, {
        withCredentials: true,
        responseType: 'blob',
      });
      // Create a link to download the file
      const downloadUrl = window.URL.createObjectURL (
        new Blob ([response.data])
      );
      const link = document.createElement ('a');
      link.href = downloadUrl;
      link.setAttribute ('download', originalName || 'file');
      document.body.appendChild (link);
      link.click ();
      link.parentNode.removeChild (link);

      // Remove the object URL after download
      window.URL.revokeObjectURL (downloadUrl);
    } catch (error) {
      console.error ('Грешка при изтегляне на файла:', error);
      alert ('Неуспешно изтегляне на файла. Моля опитайте по-късно.');
    }
  };

  if (loading) {
    return (
    <div className="flex justify-center mt-8">
      <CircularProgress />
      <Typography>Зареждане на файловете...</Typography>
    </div>
    );
  }

  if (error) {
    return (
    <Typography className="text-center mt-8 text-red-500" variant="body1">
      {error}
    </Typography>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <Stack
        direction='row'
        justifyContent='flex-start'
        mb={2}
      >
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          sx={{minWidth: '100px'}}
          onClick={() => navigate ('/admin/dashboard')}
        >
          Обратно към списъка с потребители
        </Button>
      </Stack>


      <Stack direction='row' alignItems='center' justifyContent='space-between' className='mb-4'>
        <Typography
          variant='h4'
          className='text-center flex-1'
        >
          Качени файлове
        </Typography>
      </Stack>

      {files.length === 0
        ? <Typography className="text-center text-gray-600">
            Няма качени файлове
          </Typography>
        : <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Име на файла</TableCell>
                  <TableCell>Фирма</TableCell>
                  <TableCell>Отдел</TableCell>
                  <TableCell>Качил</TableCell>
                  <TableCell>Последно изтеглен от</TableCell>
                  <TableCell>Описание</TableCell>
                  <TableCell>Дата на качване</TableCell>
                  <TableCell>Свали файла</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map (file => (
                  <TableRow key={file.id}>
                    <TableCell>{file.filename}</TableCell>
                    <TableCell>{file.company?.companyName || '-'}</TableCell>
                    <TableCell>{file.department?.departmentName || '-'}</TableCell>
                    <TableCell>{file.uploadedBy?.email || '-' }</TableCell>
                    <TableCell>{file.lastDownloadedBy?.email || '-' }</TableCell>
                    <TableCell>{file.description || '-'}</TableCell>
                    <TableCell>
                      {file.createdAt ? new Date (file.createdAt).toLocaleDateString () : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownload (file.id, file.filename)}
                      >
                        Свали
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>}
    </div>
  );
};

export default FileList;
