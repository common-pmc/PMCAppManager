import React, { useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FileUploader = ({ files, setFiles }) => {
  const fileInputRef = useRef();

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    setFiles((prevFiles) => [...prevFiles, ...fileArray]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      sx={{
        border: "2px dashed #aaa",
        borderRadius: 2,
        padding: 4,
        textAlign: "center",
        cursor: "pointer",
        mb: 2,
        backgroundColor: "#fafafa",
        "&:hover": { backgroundColor: "#f0f0f0" },
      }}
      onClick={() => fileInputRef.current.click()}
    >
      <UploadFileIcon sx={{ fontSize: 40 }} />

      <Typography>
        Кликнете или плъзнете файлове тук, за да ги качите
      </Typography>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography>Избрани файлове ({files.length}):</Typography>
          {files.map((file, index) => (
            <Typography key={index} variant="body2">
              {file.name}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FileUploader;
