import React, {useEffect, useState} from 'react';
import axiosInstance from '../api/axiosInstance';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Админ панел</h1>
      <p>Добре дошъл!</p>
    </div>
  );
};

export default Dashboard;
