import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  Stack,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SaveIcon from '@mui/icons-material/Save';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [departments, setDepartments] = useState (['']);
  const [message, setMessage] = useState ('');

  const navigate = useNavigate ();

  const handleDepartmentChange = (index, value) => {
    const updatedDepartments = [...departments];
    updatedDepartments[index] = value;
    setDepartments (updatedDepartments);
  };

  const addDepartmentField = () => {
    setDepartments ([...departments, '']);
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    try {
      const filteredDepartments = departments.filter (
        dept => dept.trim () !== ''
      );
      const response = await axiosInstance.post ('/companies', {
        companyName,
        departments: filteredDepartments,
      });
      setMessage ('Фирмата е добавена успешно');
      setCompanyName ('');
      setDepartments (['']);
      setTimeout (() => {
        navigate ('/admin/register');
      }, 1500);
    } catch (error) {
      console.error ('Error adding company:', error);
      setMessage ('Грешка при добавяне на фирмата');
    }
  };

  return (
    <Container maxWidth="sm" sx={{py: 6}}>
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
        <Stack>
          <BusinessIcon />
          <Typography variant="h6" component="h2" sx={{mb: 4}} gutterBottom>
            Добави фирма и отдели
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddCompany;
