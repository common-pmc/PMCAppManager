import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [departments, setDepartments] = useState ([]);
  const [message, setMessage] = useState ('');

  const navigate = useNavigate ();

  const handleDepartmentChange = (index, value) => {
    const updatedDepartments = [...departments];
    updatedDepartments[index] = value;
    setDepartments (updatedDepartments);
  };

  const addDepartmentField = () => {
    setDepartments ([...departments, '']);
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    try {
      const filteredDepartments = departments.filter (
        dept => dept.trim () !== ''
      );
      const response = await axiosInstance.post ('/companies', {
        companyName,
        departments: filteredDepartments,
      });
      setMessage ('Фирмата е добавена успешно');
      setCompanyName ('');
      setDepartments ([]);
      setTimeout (() => {
        navigate ('/register');
      }, 1500);
    } catch (error) {
      console.error ('Error adding company:', error);
      setMessage ('Грешка при добавяне на фирмата');
    }
  };

  return (
    <div>
      <h1>AddCompany</h1>
    </div>
  );
};

export default AddCompany;
