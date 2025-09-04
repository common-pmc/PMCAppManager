import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import FileDownloadDetailsModal from '../components/FileDownloadDetailsModal';

const FileList = () => {
  const [files, setFiles] = useState ([]);
  const [selectedFileId, setSelectedFileId] = useState (null);
  const [isModalOpen, setIsModalOpen] = useState (false);

  return (
    <div>
      <h1>File List</h1>
    </div>
  );
};

export default FileList;
