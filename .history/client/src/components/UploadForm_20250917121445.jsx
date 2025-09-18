import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {
  Box,
  Button,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  LinearProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DescriptionIcon from '@mui/icons-material/Description';

const UploadForm = () => {
  const [file, setFile] = useState (null);
  const [filename, setFilename] = useState ('');
  const [description, setDescription] = useState ('');
  const [companies, setCompanies] = useState ([]);
  const [departments, setDepartments] = useState ([]);
  const [selectedCompany, setSelectedCompany] = useState ('');
  const [selectedDepartment, setSelectedDepartment] = useState ('');
  const [message, setMessage] = useState ('');
  const [error, setError] = useState ('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState ('');
  const [progress, setProgress] = useState (0);

  const navigate = useNavigate ();

  useEffect (() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosInstance.get ('/companies');
        setCompanies (res.data);
      } catch (error) {
        console.error ('Грешка при зареждане на фирмите:', error);
        setError ('Грешка при зареждане на фирмите.');
      }
    };

    fetchCompanies ();
  }, []);

  const handleCompanyChange = async e => {
    const companyId = e.target.value;
    setSelectedCompany (companyId);
    setSelectedDepartment ('');

    // Зареждане на отделите за избраната фирма
    const company = companies.find (c => c.id === parseInt (companyId));
    setDepartments (company ? company.Departments : []);
  };

  const handleFileChange = e => {
    setFile (e.target.files[0]);
    setFilename (e.target.files[0].name);
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    setMessage ('');
    setError ('');
    setProgress (0);

    if (!file || !filename || !selectedCompany) {
      setError ('Моля, попълнете всички задължителни полета.');
      return;
    }

    const formData = new FormData ();
    formData.append ('file', file);
    formData.append ('filename', filename);
    formData.append ('description', description);
    formData.append ('companyId', selectedCompany);
    if (selectedDepartment) {
      formData.append ('departmentId', selectedDepartment);
    }

    try {
      const res = await axiosInstance.post ('/admin/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round (
            progressEvent.loaded * 100 / progressEvent.total
          );
          setProgress (percentCompleted);
        },
      });

      setMessage ('Файлът е качен успешно.');
      setUploadedFileUrl (res.data.file.url);
      setFile (null);
      setFilename ('');
      setDescription ('');
      setSelectedCompany ('');
      setSelectedDepartment ('');
      setDepartments ([]);
      setProgress (0);

      // Пренасочване към страницата с файлове след успешното качване
      setTimeout (() => {
        navigate ('/admin/files');
      }, 1500);
    } catch (error) {
      console.error ('Грешка при качване на файла:', error);
      const errorMsg = error.response &&
        error.response.data &&
        error.response.data.message
        ? error.response.data.message
        : 'Грешка при качване на файла.';
      setError (errorMsg);
      setProgress (0);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          marginTop: 8,
          padding: 4,
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" element="h2" gutterBottom>
          <UploadFileIcon sx={{mr: 1, verticalAlign: 'middle'}} />
          Качи нов файл
        </Typography>
      </Box>
    </Container>
  );
};

export default UploadForm;
