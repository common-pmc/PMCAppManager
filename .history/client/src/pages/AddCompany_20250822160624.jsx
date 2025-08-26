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

  const addCompany = async e => {
    e.preventDefault ();
    if (!companyName) return;
    try {
      const response = await axiosInstance.post ('/companies', {companyName});
      setMessage ('Фирмата е добавена успешно');
      setCompanyName ('');
    } catch (error) {
      console.error ('Error adding company:', error);
      setMessage ('Грешка при добавяне на фирма');
    }
  };

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
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Добави фирма или отдел</h2>

        <form onSubmit={addCompany} className="mb-6">
          <input
            type="text"
            placeholder="Име на фирмата"
            value={companyName}
            onChange={e => setCompanyName (e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            required
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
          >
            Добави фирма
          </button>
        </form>

        <form onSubmit={addDepartments}>
          <select name="" id="">mnm</select>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
