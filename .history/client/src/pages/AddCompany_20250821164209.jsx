import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [departmentName, setDepartmentName] = useState ('');
  const [error, setError] = useState ('');
  const [success, setSuccess] = useState ('');

  return (
    <div>
      <h1>AddCompany</h1>
    </div>
  );
};

export default AddCompany;
