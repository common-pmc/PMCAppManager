import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState ({
    email: '',
    password: '',
    company: '',
    isAdmin: false,
  });
  const [error, setError] = useState ('');
  const [success, setSuccess] = useState ('');

  const navigate = useNavigate ();

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
        className="bg-white m-8 rounded shadow-md w-full max-w-sm p-6"
        onSubmit={handleSubmit}
      >
        <h2>Регистрация на нов потребител</h2>
      </form>
    </div>
  );
};

export default Register;
