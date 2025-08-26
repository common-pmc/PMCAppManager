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

  const addDepartments = async e => {
    e.preventDefault ();
    if (!selectedCompany || !departmentName) return;
    try {
      const response = await axiosInstance.post (
        `/companies/${selectedCompany}/departments`,
        {departmentName}
      );
      setMessage ('Отделът е добавен успешно');
      setDepartmentName ('');
    } catch (error) {
      console.error ('Error adding department:', error);
      setMessage ('Грешка при добавяне на отдел');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded">jg</div>
    </div>
  );
};

export default AddCompany;
