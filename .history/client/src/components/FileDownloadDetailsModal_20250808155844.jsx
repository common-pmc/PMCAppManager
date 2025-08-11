import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';

const FileDownloadsDetailModal = ({fileId, isOpen, onClose}) => {
  const [details, setDetails] = useState ([]);
  const [loading, setLoading] = useState (true);

  useEffect (
    () => {
      if (isOpen && fileId) {
        try {
          setLoading (true);
          const fetchDetails = async () => {
            const response = await axiosInstance.get (
              `/files/${fileId}/download-details`
            );
            setDetails (response.data);
            setLoading (false);
          };
          fetchDetails ();
        } catch (error) {
          console.error ('Error fetching file download details:', error);
        }
      }
    },
    [fileId, isOpen]
  );

  if (!isOpen) return null;

  return (
    <div>
      <h1>FileDownloadsDetailModal</h1>
    </div>
  );
};

export default FileDownloadsDetailModal;
