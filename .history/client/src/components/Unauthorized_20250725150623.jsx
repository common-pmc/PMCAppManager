import React from 'react';
import {Link} from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">403 - Нямате достъп.</h1>
      <p className="text-gray-600 mb-6">
        Нямате необходимите права за достъп до тази страница.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Върнете се към началната страница
      </Link>
    </div>
  );
};

export default Unauthorized;
