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

  return (
    <div>
      <h1>UploadForm</h1>
    </div>
  );
};

export default UploadForm;
