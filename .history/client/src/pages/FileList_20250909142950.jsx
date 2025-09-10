import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
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
} from '@mui/material';

const FileList = () => {
  const [files, setFiles] = useState ([]);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  const navigate = useNavigate ();

  const fetchFiles = async () => {
    try {
      setLoading (true);
      const response = await axiosInstance.get ('/files', {
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
    <div className="flex justify-center mt-8">
      <CircularProgress />
      <Typography>Зареждане на файловете...</Typography>
    </div>;
  }

  if (error) {
    <Typography className="text-center mt-8 text-red-500" variant="body1">
      {error}
    </Typography>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <Typography variant="h4" className="mb-4 text-center">
        Качени файлове
      </Typography>
    </div>
  );
};

export default FileList;
