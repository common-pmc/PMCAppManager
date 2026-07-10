import React, { useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import usePaginatedFetch from "../hooks/usePaginatedFetch";
import { groupAdminFiles } from "../components/FileTree/treeUtils";
import FileTree from "../components/FileTree/FileTree";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Alert,
  Divider,
} from "@mui/material";

import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as FileIcon,
  Apartment as CompanyIcon,
  BusinessCenter as DepartmentIcon,
  Category as ProductTypeIcon,
  Inventory2 as ProductIcon,
  Download as DownloadIcon,
  ExpandLess,
  ExpandMore,
  MoreVert as MoreVertIcon,
  UnfoldMore as ExpandAllIcon,
  UnfoldLess as CollapseAllIcon,
} from "@mui/icons-material";

const FileList = () => {
  const {
    data: files = [],
    loading,
    error,
  } = usePaginatedFetch("/admin/files", {
    page: 1,
    limit: 10,
  });
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const groupedFiles = useMemo(() => {
    return groupAdminFiles(files);
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
      const response = await axiosInstance.get(
        `/admin/files/${file.id}/download`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", file.originalname || file.filename);

      document.body.appendChild(link);

      link.click();

      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        {error && <Alert severity="error">{error}</Alert>}

        <FileTree
          data={groupedFiles}
          icons={{
            level0: CompanyIcon,
            level1: DepartmentIcon,
            level2: ProductIcon,
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

export default FileList;
