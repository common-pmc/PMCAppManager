import React, {useEffect, useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {
  const [users, setUsers] = useState ([]);
  const [error, setError] = useState (null);

  const navigate = useNavigate ();

  useEffect (() => {}, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Админ панел</h1>
      <p>Добре дошъл!</p>
    </div>
  );
};

export default Dashboard;
