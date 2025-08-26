import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [companies, setCompanies] = useState ([]);
  const [departmentName, setDepartmentName] = useState ('');
  const [selectedCompany, setSelectedCompany] = useState ('');
  const [message, setMessage] = useState ('');

  const navigate = useNavigate ();

  useEffect (() => {
    const fetchCompanies = async (req, res) => {
      try {
        const response = await axiosInstance.get ('/companies');
        setCompanies (response.data);
      } catch (error) {
        console.error ('Error fetching companies:', error);
        setMessage ('Грешка при зареждане на фирмите');
      }
    };

    fetchCompanies ();
  }, []);

  return (
    <div>
      <h1>AddCompany</h1>
    </div>
  );
};

export default AddCompany;
