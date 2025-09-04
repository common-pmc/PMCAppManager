import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import FileDownloadDetailsModal from '../components/FileDownloadDetailsModal';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState ([]);
  const [selectedFileId, setSelectedFileId] = useState (null);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);
  const [isModalOpen, setIsModalOpen] = useState (false);

  const fetchFiles = async () => {
    try {
      setLoading (true);
      const response = await axiosInstance.get ('/files');
      setFiles (response.data);
      setLoading (false);
    } catch (error) {
      console.error ('Грешка при зареждане на файловете:', error);
      setError ('Неуспешно зареждане на файловете. Моля опитайте по-късно.');
      setLoading (false);
    }
  };

  useEffect (() => {
    fetchFiles ();
  }, []);

  const handleDownload = async fileId => {
    try {
      const response = await axiosInstance.get (
        `/files/${fileId}/download-token`,
        {
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL (new Blob ([response.data]));
      const link = document.createElement ('a');
    } catch (error) {
      //
    }
  };

  return (
    <div>
      <h1>File List</h1>
    </div>
  );
};

export default FileList;
