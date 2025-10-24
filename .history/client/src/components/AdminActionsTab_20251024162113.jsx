import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Stack, Button} from '@mui/material';

const AdminActionsTab = () => {
  const navigate = useNavigate ();

  const actions = [
    {label: 'Добави фирма / отдел', path: '/admin/companies/new'},
    {label: 'Регистрирай нов потребител', path: '/admin/register'},
    {label: 'Качи файл', path: '/admin/upload'},
    {label: 'Списък с файлове', path: '/admin/files'},
    {label: 'Филтрирай файлове', path: '/admin/filter'},
  ];

  return (
    <Stack>
      mhvvh
    </Stack>
  );
};

export default AdminActionsTab;
