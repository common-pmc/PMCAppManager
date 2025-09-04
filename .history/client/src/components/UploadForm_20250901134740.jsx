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

    // Зареждане на отделите за избраната фирма
    try {
      const res = await axiosInstance.get (
        `/departments?companyId=${companyId}`
      );
      setDepartments (res.data);
    } catch (error) {
      console.error ('Грешка при зареждане на отделите:', error);
      setError ('Грешка при зареждане на отделите.');
    }
  };

  const handleFileChange = e => {
    setFile (e.target.files[0]);
    setFilename (e.target.files[0].name);
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    setMessage ('');
    setError ('');
    setProgress (0);

    if (!file || !filename || !selectedCompany) {
      setError ('Моля, попълнете всички задължителни полета.');
      return;
    }

    const formData = new FormData ();
    formData.append ('file', file);
    formData.append ('filename', filename);
    formData.append ('description', description);
    formData.append ('companyId', selectedCompany);
    if (selectedDepartment) {
      formData.append ('departmentId', selectedDepartment);
    }

    try {
      const res = await axiosInstance.post ('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round (
            progressEvent.loaded * 100 / progressEvent.total
          );
          setProgress (percentCompleted);
        },
      });
    } catch (error) {
      //
    }
  };

  return (
    <div>
      <h2>Upload Form</h2>
    </div>
  );
};

export default UploadForm;
