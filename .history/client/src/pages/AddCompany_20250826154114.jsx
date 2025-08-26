import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [departments, setDepartments] = useState (['']);
  const [message, setMessage] = useState ('');

  const navigate = useNavigate ();

  const handleDepartmentChange = (index, value) => {};

  return (
    <div>
      <h1>AddCompany</h1>
    </div>
  );
};

export default AddCompany;
