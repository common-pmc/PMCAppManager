import React, {useState} from 'react';
import axiosInstance from '../api/axiosInstance';

const UploadForm = () => {
  const [file, setFile] = useState (null);
  const [message, setMessage] = useState ('');

  return (
    <div>
      <h1>UploadForm</h1>
    </div>
  );
};

export default UploadForm;
