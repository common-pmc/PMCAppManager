import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [companies, setCompanies] = useState ([]);
  const [departmentName, setDepartmentName] = useState ('');
  const [selectedCompany, setSelectedCompany] = useState ('');

  return (
    <div>
      <h1>AddCompany</h1>
    </div>
  );
};

export default AddCompany;
