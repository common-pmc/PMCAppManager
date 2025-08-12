import React, {useState, useEffect} from 'react';
import axiosInstance from '../api/axiosInstance';

const FileDownloadDetailsModal = ({fileId, isOpen, onClose}) => {
  const [details, setDetails] = useState ([]);
  const [loading, setLoading] = useState (true);

  useEffect (
    () => {
      if (!isOpen || !fileId) return;

      const fetchDetails = async () => {
        setLoading (true);
        try {
          const response = await axiosInstance.get (
            `/logs/${fileId}/download-details`
          );
        } catch (error) {
          //
        }
      };
    },
    [fileId, isOpen]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w 4-xl">
        <h2>Детайли</h2>
        {loading
          ? <p>Зареждане...</p>
          : <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Потребител</th>
                  <th className="border p-2">Фирма</th>
                  <th className="border p-2">Дата</th>
                  <th className="border p-2">IP адрес</th>
                  <th className="border p-2">Браузър</th>
                </tr>
              </thead>
              <tbody>
                {details.map ((detail, index) => (
                  <tr key={index}>
                    <td className="border p-2">{detail.userEmail}</td>
                    <td className="border p-2">{detail.company}</td>
                    <td className="border p-2">
                      {new Date (detail.createdAt).toLocaleString ('bg-BG')}
                    </td>
                    <td className="border p-2">{detail.ipAddress || '-'}</td>
                    <td className="border p-2">{detail.userAgent || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>}

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Затвори
          </button>
        </div>

      </div>
    </div>
  );
};

export default FileDownloadDetailsModal;
