import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const UploadForm = () => {
  const [file, setFile] = useState (null);
  const [filename, setFilename] = useState ('');
  const [description, setDescription] = useState ('');
  const [users, setUsers] = useState ([]);
  const [selectedUserId, setSelectedUserId] = useState ('');
  const [message, setMessage] = useState ('');
  const [error, setError] = useState ('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState ('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Грешка при зареждане на потребители:', error);
      }
    };

    fetchUsers();
  }, [])

  const navigate = useNavigate ();

  const handleFileChange = e => {
    setFile (e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    setMessage ('');
    setError ('');

    if (!file || !filename) {
      setMessage ('Моля попълнете всички задължителни полета.');
    }

    const formData = new FormData ();
    formData.append ('file', file);
    formData.append('filename', filename);
    formData.append ('description', description);
    formData.append ('userId', selectedUserId);

    try {
      const response = await axiosInstance.post ('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage ('Файлът е качен успешно.');
      setUploadedFileUrl (response.data.fileUrl);
      // Reset form fields
      setFile (null);
      setFilename ('');
      setDescription ('');
      setTimeout (() => {
        navigate ('/dashboard'); // Redirect to dashboard after upload
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Възникна грешка при качването на файла.';
      setError (msg);
    }
  };

  return (
    <React.Fragment>
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Качване на файл</h2>
  <div className="mb-4">
    <label
      htmlFor="file-upload"
      className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded inline-block"
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
    {file && (
      <p className="text-sm mt-2 text-gray-600">Избран файл: {file.name}</p>
    )}
  </div>
      <select
        value={selectedUserId}
        onChange={e => setSelectedUserId (e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      >
        <option value="">Избери потребител</option>
        {users.map (user => (
          <option key={user.id} value={user.id}>
            {user.username} ({user.email})
          </option>
        ))}
      </select>
      <textarea
        value={description}
        onChange={e => setDescription (e.target.value)}
        placeholder="Описание (по избор)"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Качи файл
      </button>

      {message && (
        <p className="mt-4 text-green-600 font-medium text-center">
          {message}
        </p>
      )}
      {uploadedFileUrl && (
        <p className="mt-2 text-green-600 text-sm text-center">
          Файлът е достъпен на: 
          <a href={uploadedFileUrl} 
            target="_blank" 
            rel="noopener noreferrer">
              {uploadedFileUrl}
          </a>
        </p>
      )}
      {error && (
        <p className="mt-4 text-red-600 font-medium text-center">{error}</p>
      )}
    </form>
    </React.Fragment>
  );
};

export default UploadForm;
