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
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: 'background.paper',
        }}
      >
        jghjj
      </Box>
    </Container>
  );
};

export default AddCompany;
