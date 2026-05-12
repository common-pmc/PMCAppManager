import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const useFileUploads = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadController, setUploadController] = useState(null);

  const uploadFiles = async (formData) => {
    const controller = new AbortController();
    setUploadController(controller);

    setUploading(true);

    try {
      const response = await axiosInstance.post(
        "/admin/files/upload",
        formData,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      return response;
    } finally {
      setUploading(false);
      setUploadController(null);
    }
  };

  const cancelUpload = () => {
    if (uploadController) {
      uploadController.abort();
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    files,
    setFiles,
    uploading,
    uploadProgress,
    uploadFiles,
    cancelUpload,
  };
};
