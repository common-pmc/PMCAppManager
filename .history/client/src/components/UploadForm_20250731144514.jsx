import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';

const UploadForm = () => {
  const [file, setFile] = useState (null);
  const [filename, setFilename] = useState ('');
  const [description, setDescription] = useState ('');
  const [message, setMessage] = useState ('');

  const handleFileChange = e => {
    setFile (e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    if (!file) {
      setMessage ('Моля изберете файл.');
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
      setFile (null);
      setFilename ('');
      setDescription ('');
    } catch (error) {
      setMessage ('Грешка при качването на файла: ' + error.message);
      console.error ('Upload error:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white shadow rounded"
    >
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
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
        placeholder="Описание"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Качи файл
      </button>

      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </form>
  );
};

export default UploadForm;
