import React, {useState, useEffect} from 'react';
import axiosInstance from '../axiosInstance';

const FileList = () => {
  const [files, setFiles] = useState ([]);

  useEffect (() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get ('/api/files');
        setFiles (response.data);
      } catch (error) {
        console.error ('Error fetching files:', error);
      }
    };

    fetchFiles ();
  }, []);

  return (
    <div>
      <h1>FileList</h1>
    </div>
  );
};

export default FileList;
