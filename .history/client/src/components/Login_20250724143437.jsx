import React, {useState} from 'react';
import axios from 'axios';
import {InputOptions} from '../../node_modules/rollup/dist/rollup.d';

const Login = () => {
  const handleLogin = () => {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white m-8 rounded shadow-md w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-center text-gray-700 p-4">
          ВХОД
        </h2>

        <input
          type="email"
          placeholder="Имейл"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Парола"
          className="w-full p-2 border border-gray-300 rounded mb-6"
          required
        />
      </form>
    </div>
  );
};

export default Login;
