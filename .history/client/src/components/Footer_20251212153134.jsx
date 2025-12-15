import React from 'react';

const Footer = () => {
  const year = new Date ().getFullYear ();

  return (
    <div className="text-2xs text-gray-600 mt-4 bg-gray-300 flex flex-start pl-4">
      <p>
        <i>
          Разработено от Пи Ем Си ООД. Всички права запазени
          {' '}
          <sup>&copy;</sup>{year}.
        </i>
      </p>
    </div>
  );
};

export default Footer;
