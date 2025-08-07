import React from 'react';
import UploadForm from '../components/UploadForm';

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1>Качване на файл:</h1>
      <UploadForm />
    </div>
  );
};

export default Upload;
