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

  return (
    <div>
      <h1>Register</h1>
    </div>
  );
};

export default Register;
