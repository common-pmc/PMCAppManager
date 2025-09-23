import React, {useEffect, useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const Dashboard = () => {
  const [users, setUsers] = useState ([]);
  const [error, setError] = useState ('');
  const navigate = useNavigate ();

  useEffect (() => {
    axiosInstance
      .get ('/users')
      .then (res => setUsers (res.data))
      .catch (err => {
        console.error ('Error:', err);
        setError ('Грешка при зареждане на потребителите');
      });
  }, []);

  console.log ('Users:', users);

  return (
    <div className="bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Добре дошъл, администраторе!</h1>

      {error
        ? <p className="text-red-500">{error}</p>
        : <div className="p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Потребители</h2>
            <ul className="space-y-2">
              {users.map (user => (
                <li key={user.id} className="border-b pb-2 text-gray-700">
                  <strong>{user.email}</strong>
                  {' '}
                  –
                  {' '}
                  {user.Company && user.Company.companyName
                    ? user.Company.companyName
                    : <span className="italic text-gray-400">
                        (няма фирма)
                      </span>}
                  {user.Department && user.Department.departmentName
                    ? `-${user.Department.departmentName}`
                    : null}
                  {' '}
                  {user.isAdmin &&
                    <span className="text-blue-500">(админ)</span>}
                </li>
              ))}
            </ul>
          </div>}

      <div className="mt-6 mb-2 flex gap-4">
        <button
          onClick={() => navigate ('/admin/register')}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Регистрирай нов потребител
        </button>
        <button
          onClick={() => navigate ('/admin/upload')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Качи файл
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          disabled
        >
          Филтрирай по фирма
        </button>
        <button
          onClick={() => navigate ('/admin/files')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
        >
          Списък с файлове
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
