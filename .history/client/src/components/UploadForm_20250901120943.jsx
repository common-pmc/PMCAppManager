import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const UploadForm = () => {
  const [file, setFile] = useState (null);

  return (
    <div>
      <h2>Upload Form</h2>
    </div>
  );
};

export default UploadForm;
