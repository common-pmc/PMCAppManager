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

  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await axiosInstance.get (
        `/files/${fileId}/download-token`,
        {
          responseType: 'blob',
        }
      );
      const downloadUrl = window.URL.createObjectURL (
        new Blob ([response.data])
      );
      const link = document.createElement ('a');
      link.href = downloadUrl;
      link.setAttribute ('download', originalName || 'file'); // You can set the file name here
      document.body.appendChild (link);
      link.click ();
      link.parentNode.removeChild (link);
    } catch (error) {
      console.error ('Грешка при изтегляне на файла:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Качени файлове</h2>
    </div>
  );
};

export default FileList;
