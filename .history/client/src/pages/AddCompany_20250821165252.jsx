import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [departmentName, setDepartmentName] = useState ('');
  const [error, setError] = useState ('');
  const [success, setSuccess] = useState ('');

  const navigate = useNavigate ();

  const addDepartmentRow = () => setDepartmentName (prev => [...prev, '']);
  const removeDepartmentRow = index => {
    setDepartmentName (prev => prev.filter ((_, i) => i !== index));
  };

  return (
    <div>
      <h1>AddCompany</h1>
    </div>
  );
};

export default AddCompany;
