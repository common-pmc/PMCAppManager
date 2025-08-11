import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';

const FileDownloadsDetailModal = ({fileId, isOpen, onClose}) => {
  const [details, setDetails] = useState ([]);
  const [loading, setLoading] = useState (true);

  useEffect (
    () => {
      if (isOpen && fileId) {
      }
    },
    [fileId, isOpen]
  );

  return (
    <div>
      <h1>FileDownloadsDetailModal</h1>
    </div>
  );
};

export default FileDownloadsDetailModal;
