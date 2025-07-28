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
    <div>
      <h1>Добре дошъл, адни</h1>
    </div>
  );
};

export default Dashboard;
