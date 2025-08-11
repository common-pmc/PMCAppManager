import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import FileDownloadDetailsModal from '../components/FileDownloadDetailsModal';

const FileList = () => {
  const [files, setFiles] = useState ([]);
  const [selectedFileId, setSelectedFileId] = useState (null);
  const [isModalOpen, setIsModalOpen] = useState (false);

  const navigate = useNavigate ();

  useEffect (() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get ('/files');
        setFiles (response.data);
      } catch (error) {
        console.error ('Грешка при зареждане на файлове:', error);
      }
    };

    fetchFiles ();
  }, []);

  const handleOpenModal = (fileId) => {
    setSelectedFileId (fileId);
    setIsModalOpen (true);
  }

  const handleCloseModal = () => {
    setIsModalOpen (false);
    setSelectedFileId (null);
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Качени файлове</h2>
      <button
            className="mb-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            onClick={() => navigate ('/dashboard')}
          >Обратно към списъка с потребители
      </button>
      {files.length === 0
        ? <p className="text-center text-gray-500">Няма качени файлове.</p>
        : <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Оригинално име</th>
                <th className="border p-2">Име на сървъра</th>
                <th className="border p-2">Фирма</th>
                <th className='border p-2'>Потребител</th>
                <th className="border p-2">Дата</th>
              </tr>
            </thead>
            <tbody>
              {files.map (file => (
                <tr key={file.id}>
                  <td className="border p-2">{file.filename}</td>
                  <td className="border p-2">{file.serverFilename}</td>
                  <td className="border p-2">{file.owner?.company || '-'}</td>
                  <td className='border p-2'>{file.owner?.email || '-'}</td>
                  <td className="border p-2">
                    {new Date (file.createdAt).toLocaleString ('bg-BG')}
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleOpenModal(file.id)}>Детайли</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}

          {
            isModalOpen && (
              <FileDownloadDetailsModal 
                fileId={selectedFileId}
              />
            )
          }
    </div>
  );
};

export default FileList;
