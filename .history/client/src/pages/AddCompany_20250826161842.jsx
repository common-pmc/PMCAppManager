import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';
import {useNavigate} from 'react-router-dom';

const AddCompany = () => {
  const [companyName, setCompanyName] = useState ('');
  const [departments, setDepartments] = useState (['']);
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
      setDepartments (['']);
      setTimeout (() => {
        navigate ('/register');
      }, 1500);
    } catch (error) {
      console.error ('Error adding company:', error);
      setMessage ('Грешка при добавяне на фирмата');
    }
  };

  return (
    <div className="main-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Добави фирма и отдели</h2>

        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Име на фирма"
          value={companyName}
          onChange={e => setCompanyName (e.target.value)}
          required
        />

        {departments.map ((dept, idx) => (
          <input
            key={idx}
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder={`Отдел ${idx + 1}`}
            value={dept}
            onChange={e => handleDepartmentChange (idx, e.target.value)}
            required
          />
        ))}
      </form>
    </div>
  );
};

export default AddCompany;
