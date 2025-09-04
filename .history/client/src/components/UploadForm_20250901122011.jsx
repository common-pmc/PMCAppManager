import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const UploadForm = () => {
  const [file, setFile] = useState (null);
  const [filename, setFilename] = useState ('');
  const [description, setDescription] = useState ('');
  const [companies, setCompanies] = useState ([]);
  const [departments, setDepartments] = useState ([]);
  const [selectedCompany, setSelectedCompany] = useState ('');
  const [selectedDepartment, setSelectedDepartment] = useState ('');
  const [message, setMessage] = useState ('');
  const [error, setError] = useState ('');
  const [uploadedFile, setUploadedFile] = useState ('');
  const [progress, setProgress] = useState (0);

  const navigate = useNavigate ();

  useEffect (() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosInstance.get ('/companies');
        setCompanies (res.data);
      } catch (error) {
        console.error ('Грешка при зареждане на фирмите:', error);
        setError ('Грешка при зареждане на фирмите.');
      }

      fetchCompanies ();
    };
  }, []);

  const handleCompanyChange = async e => {
    const companyId = e.target.value;
    setSelectedCompany (companyId);
    setSelectedDepartment ('');
    setDepartments ([]);
  };

  return (
    <div>
      <h2>Upload Form</h2>
    </div>
  );
};

export default UploadForm;
