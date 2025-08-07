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
      setMessage (response.data.message);
      setFile (null);
      setFilename ('');
      setDescription ('');
    } catch (error) {
      setMessage ('Error uploading file: ' + error.message);
    }
  };

  return (
    <div>
      <h1>UploadForm</h1>
    </div>
  );
};

export default UploadForm;
