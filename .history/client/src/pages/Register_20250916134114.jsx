import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate, Link} from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState ({
    email: '',
    password: '',
    companyId: '',
    departmentId: '',
    isAdmin: false,
  });
  const [companies, setCompanies] = useState ([]);
  const [departments, setDepartments] = useState ([]);
  const [error, setError] = useState ('');
  const [success, setSuccess] = useState ('');

  const navigate = useNavigate ();

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get ('/companies');
      setCompanies (response.data);
    } catch (error) {
      console.error ('Error fetching companies:', error);
      setError ('Грешка при зареждане на фирмите');
    }
  };

  useEffect (() => {
    fetchCompanies ();
  }, []);

  const handleChange = e => {
    const {name, value, type, checked} = e.target;
    setFormData ({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Ако сменяме фирмата — обновяваме отделите
  const handleCompanyChange = e => {
    const {value} = e.target;
    setFormData ({
      ...formData,
      companyId: value,
      departmentId: '', // Reset department when company changes
    });
    const selectedCompany = companies.find (
      company => company.id === Number (value)
    );
    if (selectedCompany && selectedCompany.Departments) {
      setDepartments (selectedCompany.Departments);
    } else {
      setDepartments ([]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    setError ('');
    setSuccess ('');

    try {
      const token = localStorage.getItem ('token');
      await axiosInstance.post ('/users/register', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess ('Потребителят е регистриран успешно!');
      setFormData ({
        email: '',
        password: '',
        companyId: '',
        departmentId: '',
        isAdmin: false,
      });
      setDepartments ([]);

      setTimeout (() => {
        navigate ('/admin/dashboard');
      }, 1500); // Redirect after 1.5 seconds
    } catch (error) {
      console.error ('Error:', error);
      setError ('Грешка при регистрацията на потребителя');
    }
  };

  return (
    <Container>
      <Box>jghgs</Box>
    </Container>
  );
};

export default Register;
