import React, {useState, useEffect} from 'react';
import axiosInstance from '../axiosInstance';

const FileList = () => {
  const [files, setFiles] = useState ([]);

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

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Качени файлове</h2>
      {files.length === 0
        ? <p className="text-center text-gray-500">Няма качени файлове.</p>
        : <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Оригинално име</th>
                <th className="py-2 px-4 border-b">Име на сървъра</th>
                <th className="py-2 px-4 border-b">Фирма</th>
              </tr>
            </thead>
          </table>}
    </div>
  );
};

export default FileList;
