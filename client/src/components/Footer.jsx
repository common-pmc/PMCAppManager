import React from 'react';

const Footer = () => {
  const year = new Date ().getFullYear ();

  return (
    <div className="text-2xs text-gray-600 mt-4 bg-gray-300 flex flex-start pl-4">
      <p>
        <i>
          <sup>&copy;</sup>
          {year}
          {' '}
          Разработено от Пи Ем Си ООД. Всички права запазени.
        </i>
      </p>
    </div>
  );
};

export default Footer;
