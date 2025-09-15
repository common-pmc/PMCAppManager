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
  const [uploadedFileUrl, setUploadedFileUrl] = useState ('');
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
    };

    fetchCompanies ();
  }, []);

  const handleCompanyChange = async e => {
    const companyId = e.target.value;
    setSelectedCompany (companyId);
    setSelectedDepartment ('');

    // Зареждане на отделите за избраната фирма
    const company = companies.find (c => c.id === parseInt (companyId));
    setDepartments (company ? company.Departments : []);
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
      const res = await axiosInstance.post ('/admin/files/upload', formData, {
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round (
            progressEvent.loaded * 100 / progressEvent.total
          );
          setProgress (percentCompleted);
        },
      });

      setMessage ('Файлът е качен успешно.');
      setUploadedFileUrl (res.data.file.url);
      setFile (null);
      setFilename ('');
      setDescription ('');
      setSelectedCompany ('');
      setSelectedDepartment ('');
      setDepartments ([]);
      setProgress (0);

      // Пренасочване към страницата с файлове след успешното качване
      setTimeout (() => {
        navigate ('/files');
      }, 1500);
    } catch (error) {
      console.error ('Грешка при качване на файла:', error);
      const errorMsg = error.response &&
        error.response.data &&
        error.response.data.message
        ? error.response.data.message
        : 'Грешка при качване на файла.';
      setError (errorMsg);
      setProgress (0);
    }
  };

  return (
    <div>
      <form
        className="max-w-md mx-auto p-4 bg-white shadow rounded"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded inline-block"
          >
            Избери файл
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            required
          />
          {file &&
            <p className="text-sm mt-2 text-gray-600">
              Избран файл: {file.name}
            </p>}
        </div>
        <select
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        >
          <option value="">Избери фирма</option>
          {companies.map (company => (
            <option key={company.id} value={company.id}>
              {company.companyName}
            </option>
          ))}
        </select>

        {departments.length > 0 &&
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment (e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Избери отдел (по избор)</option>
            {departments.map (dept => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>}

        <textarea
          value={description}
          onChange={e => setDescription (e.target.value)}
          placeholder="Описание (по избор)"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows="3"
        />

        {progress > 0 &&
          <div className="w-full bg-gray-200 rounded-full mb-4">
            <div
              className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full"
              style={{width: `${progress}%`}}
            >
              {progress}%
            </div>
          </div>}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Качи файл
        </button>

        {message &&
          <p className="mt-4 text-green-600 font-semibold">{message}</p>}
        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
        {uploadedFileUrl &&
          <div className="mt-4">
            <p className="font-semibold">Каченият файл е достъпен на:</p>
            <a
              href={uploadedFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 underline"
            >
              {uploadedFileUrl}
            </a>
          </div>}
      </form>
    </div>
  );
};

export default UploadForm;
