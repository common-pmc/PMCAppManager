import React from 'react';
import {Link} from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">403 - Нямате достъп.</h1>
    </div>
  );
};

export default Unauthorized;
