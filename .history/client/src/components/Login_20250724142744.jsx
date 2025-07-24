import React, {useState} from 'react';
import axios from 'axios';

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
      </form>
    </div>
  );
};

export default Login;
