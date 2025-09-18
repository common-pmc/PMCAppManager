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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">
          Регистрация на нов потребител
        </h2>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Имейл"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Парола"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <select
          name="companyId"
          value={formData.companyId}
          onChange={handleCompanyChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        >
          <option value="">--Избери фирма--</option>
          {companies.map (company => (
            <option key={company.id} value={company.id}>
              {company.companyName}
            </option>
          ))}
        </select>

        {departments.length > 0 &&
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">--Избери отдел--</option>
            {departments.map (department => (
              <option key={department.id} value={department.id}>
                {department.departmentName}
              </option>
            ))}
          </select>}

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
            className="mr-2"
          />
          Администатор
        </label>

        <div className="mb-4 text-sm">
          Няма я фирмата?
          <Link className="text-blue-600 underline" to="/admin/companies/new">
            Добави фирма / отдел
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Създай потребител
        </button>
      </form>
    </div>
  );
};

export default Register;
