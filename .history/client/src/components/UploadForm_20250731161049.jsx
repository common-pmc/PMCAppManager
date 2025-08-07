import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';

const UploadForm = () => {
  const [file, setFile] = useState (null);
  const [filename, setFilename] = useState ('');
  const [description, setDescription] = useState ('');
  const [message, setMessage] = useState ('');
  const [error, setError] = useState ('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState ('');

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
    formData.append ('filename', filename);
    formData.append ('description', description);

    try {
      const response = await axiosInstance.post ('/upload', formData, {
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
    } catch (error) {
      const msg = error.response?.data?.message || 'Възникна грешка при качването на файла.';
      setError (msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Качване на файл</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 w-full"
        required
      />
      <input
        type="text"
        value={filename}
        onChange={e => setFilename (e.target.value)}
        placeholder="Име на файла"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        required
      />
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
  );
};

export default UploadForm;
