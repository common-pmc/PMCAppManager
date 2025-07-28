import React, {useEffect, useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {
  const [users, setUsers] = useState ([]);
  const [error, setError] = useState (null);

  const navigate = useNavigate ();

  useEffect (
    () => {
      axiosInstance
        .get ('/api/users')
        .then (response => {
          setUsers (response.data);
        })
        .catch (err => {
          if (err.response && err.response.status === 403) {
            navigate ('/unauthorized');
          } else {
            setError ('Грешка при зареждане на потребителите');
          }
        });
    },
    [navigate]
  );

  return (
    <div className="p-6">
      <h1 text-2xl font-bold mb-6>Добре дошъл, администраторе!</h1>

      <div className="mb-4 flex gap-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          onClick={() => navigate ('/register')}
        >
          Регитрация на нов потребител
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
