import React from 'react';
import UploadForm from '../components/UploadForm';

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Качване на файл:</h1>
      <UploadForm />
    </div>
  );
};

export default Upload;
