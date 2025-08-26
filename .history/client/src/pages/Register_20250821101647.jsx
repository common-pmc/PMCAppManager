import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

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

  useEffect (() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get ('/companies');
        setCompanies (response.data);
      } catch (error) {
        console.error ('Error fetching companies:', error);
        setError ('Грешка при зареждане на фирмите');
      }
    };

    fetchCompanies ();
  }, []);

  const handleCompanyChange = async e => {
    const companyId = e.target.value;
    setFormData (prev => ({
      ...prev,
      companyId,
      departmentId: '', // Reset department when company changes
    }));
    setDepartments ([]); // Clear departments
  };

  const handleChange = e => {
    const {name, value, type, checked} = e.target;
    setFormData ({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    setError ('');
    setSuccess ('');

    try {
      const token = localStorage.getItem ('token');
      await axiosInstance.post ('/users/register', formData);
      setSuccess ('Потребителят е регистриран успешно!');
      setFormData ({
        email: '',
        password: '',
        company: '',
        isAdmin: false,
      });
      setTimeout (() => {
        navigate ('/dashboard');
      }, 2000); // Redirect after 2 seconds
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

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Фирма"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

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
