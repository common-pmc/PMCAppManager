import React, {useState} from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState ({
    email: '',
    password: '',
  });

  const handleLogin = () => {};

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
