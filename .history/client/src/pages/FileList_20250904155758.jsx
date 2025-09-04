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

  const navigate = useNavigate ();

  const fetchFiles = async () => {
    try {
      setLoading (true);
      const response = await axiosInstance.get ('/files', {
        withCredentials: true,
      });
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
      const response = await axiosInstance.get (`/files/${fileId}/download`, {
        withCredentials: true,
        responseType: 'blob',
      });
      // Create a link to download the file
      const downloadUrl = window.URL.createObjectURL (
        new Blob ([response.data])
      );
      const link = document.createElement ('a');
      link.href = downloadUrl;
      link.setAttribute ('download', originalName || 'file'); // You can set the file name here
      document.body.appendChild (link);
      link.click ();
      link.parentNode.removeChild (link);

      // Remove the object URL after download
      window.URL.revokeObjectURL (downloadUrl);
    } catch (error) {
      console.error ('Грешка при изтегляне на файла:', error);
      alert ('Неуспешно изтегляне на файла. Моля опитайте по-късно.');
    }
  };

  if (loading)
    return <p className="text-center mt-8">Зареждане на файловете...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Качени файлове</h2>

      {files.length === 0
        ? <p className="text-center text-gray-600">Няма качени файлове.</p>
        : <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Име на файла</th>
                <th className="border p-2">Оригинално име</th>
                <th className="border p-2">Фирма</th>
                <th className="border p-2">Отдел</th>
                <th className="border p-2">Качил</th>
                <th className="border p-2">Последно изтеглен от</th>
                <th className="border p-2">Описание</th>
                <th className="border p-2">Дата на качване</th>
                <th className="border p-2">Свали файла</th>
              </tr>
            </thead>
            <tbody>
              {files &&
                files.map (file => (
                  <tr key={file.id}>
                    <td className="border p-2">{file.filename}</td>
                    <td className="border p-2">{file.originalName}</td>
                    <td className='border p-2'>{file.company?.companyName || '-'}</td>
                    <td className='border p-2'>{file.department?.departmentName || '-'}</td>
                    <td className='border p-2'>{file.uploadedBy?.email || '-'}</td>
                    <td className='border p-2'>{file.lastDownloadedBy?.email || '-'}</td>
                    <td className='border p-2'>{file.description || '-'}</td>
                    <td className='border p-2'>
                      {file.createdAt ? new Date(file.createdAt).toLocaleString('bg-BG') : '-'}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDownload (file.id, file.originalName)}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
                      >
                        Свали
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>}
    </div>
  );
};

export default FileList;
