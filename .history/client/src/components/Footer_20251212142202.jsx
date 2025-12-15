import React from 'react';

const Footer = () => {
  const year = new Date ().getFullYear ();

  return (
    <div className="text-2xs text-gray-600 mt-4 bg-gray-300">
      <p>
        Разработено от Пи Ем Си ООД. Всички права запазени
        <sup>&copy;</sup>
        {' '}
        {year}
        .
      </p>
    </div>
  );
};

export default Footer;
