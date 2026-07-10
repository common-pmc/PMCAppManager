import React, { useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import usePaginatedFetch from "../hooks/usePaginatedFetch";

import FileTree from "../components/FileTree/FileTree";
import { groupUserFiles } from "../components/FileTree/treeUtils";

import {
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";

import {
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const UserFiles = () => {
  const {
    data: files = [],
    loading,
    error,
  } = usePaginatedFetch("/user", {
    page: 1,
    limit: 100,
  });

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const groupedFiles = useMemo(() => {
    return groupUserFiles(files);
  }, [files]);

  const handleMenuOpen = (event, file) => {
    setMenuAnchor(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedFile(null);
  };

  const handleDownload = async (file) => {
    try {
      const response = await axiosInstance.get(`/user/${file.id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", file.originalname || file.filename);

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Файлове за изтегляне
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <FileTree
          data={groupedFiles}
          icons={{
            level0: null, // няма фирма
            level1: null, // отдел
            level2: null, // продукт
          }}
          renderFileMenu={(file) => (
            <IconButton onClick={(e) => handleMenuOpen(e, file)}>
              <MoreVertIcon />
            </IconButton>
          )}
        />

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleDownload(selectedFile);
              handleMenuClose();
            }}
          >
            <DownloadIcon sx={{ mr: 1 }} />
            Download
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default UserFiles;
