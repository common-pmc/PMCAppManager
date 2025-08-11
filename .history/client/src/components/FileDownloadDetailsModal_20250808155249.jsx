import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';

const FileDownloadsDetailModal = ({fileId, isOpen, onClose}) => {
  const [details, setDetails] = useState ([]);

  return (
    <div>
      <h1>FileDownloadsDetailModal</h1>
    </div>
  );
};

export default FileDownloadsDetailModal;
