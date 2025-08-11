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
              `/api/logs/${fileId}/download-details`
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg">jhj</div>
    </div>
  );
};

export default FileDownloadsDetailModal;
