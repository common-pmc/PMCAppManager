import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate, Link} from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import HowToRegIcon from '@mui/icons-material/HowToReg';

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
  const [showPassword, setShowPassword] = useState (false);

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
        <Typography element="h1" variant="h5" align="center" gutterBottom>
          Регистрация на нов потребител
        </Typography>

        {error &&
          <Alert severity="error" sx={{marginBottom: 2}}>{error}</Alert>}
        {success &&
          <Alert severity="success" sx={{marginBottom: 2}}>{success}</Alert>}

        <TextField
          label="Имейл"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="standard"
          required
        />

        <TextField
          label="Парола"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="standard"
          required
          slotProps={{
            input: {
              type: showPassword ? 'text' : 'password',
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword (!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <FormControl variant="standard" fullWidth margin="normal">
          <InputLabel id="company-label">Фирма</InputLabel>
          <Select
            labelId="company-label"
            name="companyId"
            value={formData.companyId}
            onChange={handleCompanyChange}
            label="Фирма"
          >
            {companies.map (company => (
              <MenuItem key={company.id} value={company.id}>
                {company.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {departments.length > 0 &&
          <FormControl variant="standard" fullWidth margin="normal">
            <InputLabel id="department-label">Отдел</InputLabel>
            <Select
              labelId="department-label"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              label="Отдел"
            >
              {departments.map (department => (
                <MenuItem key={department.id} value={department.id}>
                  {department.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>}

        <FormControlLabel
          control={
            <Checkbox
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
          }
          label="Администратор"
          margin="normal"
        />

        <Grid container justifyContent="space-between" sx={{mt: 1, mb: 2}}>
          <Typography variant="body2">
            Няма я фирмата?{' '}
            <Link to="/admin/companies/new" style={{color: '#1976d2'}}>
              Добави фирма / отдел
            </Link>
          </Typography>
        </Grid>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Регистрация
        </Button>

      </Box>
    </Container>
  );
};

export default Register;
