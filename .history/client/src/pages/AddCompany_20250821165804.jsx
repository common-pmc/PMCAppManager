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
  const changeDepartment = (index, value) => {
    setDepartmentName (prev =>
      prev.map ((dept, i) => (i === index ? value : dept))
    );
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    setError ('');
    setSuccess ('');
  };

  try {
    const cleanDepartments = departmentName.filter (
      dept => dept.trim () !== ''
    );
  } catch (error) {
    console.error ('Error:', error);
    setError ('Грешка при добавяне на фирмата');
  }

  return (
    <div>
      <h1>AddCompany</h1>
    </div>
  );
};

export default AddCompany;
