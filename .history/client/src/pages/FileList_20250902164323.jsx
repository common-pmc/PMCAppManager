import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import FileDownloadDetailsModal from '../components/FileDownloadDetailsModal';

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
