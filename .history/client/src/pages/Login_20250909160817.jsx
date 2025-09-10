import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState ({
    email: '',
    password: '',
  });
  const [error, setError] = useState ('');

  const navigate = useNavigate ();

  const handleLogin = async e => {
    e.preventDefault ();
    setError (''); // Reset error state

    try {
      const res = await axios.post ('/api/auth/login', formData);

      const token = res.data.accessToken;
      localStorage.setItem ('token', token); // Store token in localStorage

      console.log ('Влизането е успешно: Token:', token);
      // Redirect or update UI as needed
      navigate ('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error ('Login error:', error);
      setError ('Грешка при влизане. Моля, опитайте отново.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white m-8 rounded shadow-md w-full max-w-sm p-6"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          ВХОД
        </h2>

        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData ({...formData, email: e.target.value})}
          placeholder="Имейл"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData ({...formData, password: e.target.value})}
          placeholder="Парола"
          className="w-full p-2 border border-gray-300 rounded mb-6"
          required
        />

        {error &&
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Влез
        </button>
      </form>
    </div>
  );
};

export default Login;
