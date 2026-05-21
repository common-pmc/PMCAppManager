import React, { useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import usePaginatedFetch from "../hooks/usePaginatedFetch";

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

  const [expanded, setExpanded] = useState({});
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const groupedFiles = useMemo(() => {
    return files.reduce((acc, file) => {
      const company = file.company?.companyName || "Без фирма";

      const department = file.department?.departmentName || "Без отдел";

      const product = file.productName || "Без продукт";

      const productType = file.productType || "Други";

      if (!acc[company]) {
        acc[company] = {};
      }

      if (!acc[company][department]) {
        acc[company][department] = {};
      }

      if (!acc[company][department][product]) {
        acc[company][department][product] = {};
      }

      if (!acc[company][department][product][productType]) {
        acc[company][department][product][productType] = [];
      }

      acc[company][department][product][productType].push(file);

      return acc;
    }, {});
  }, [files]);

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};

    files.forEach((file) => {
      const company = file.company?.companyName || "Без фирма";

      const department = file.department?.departmentName || "Без отдел";

      const product = file.productName || "Без продукт";

      const productType = file.productType || "Други";

      allExpanded[company] = true;
      allExpanded[`${company}-${department}`] = true;
      allExpanded[`${company}-${department}-${product}`] = true;
      allExpanded[`${company}-${department}-${product}-${productType}`] = true;
    });

    setExpanded(allExpanded);
  };

  const collapseAll = () => {
    setExpanded({});
  };

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

  const renderFiles = (files) => {
    return files.map((file) => (
      <ListItemButton
        key={file.id}
        sx={{
          pl: 10,
          borderRadius: 2,
        }}
      >
        <ListItemIcon>
          <FileIcon />
        </ListItemIcon>

        <ListItemText
          primary={file.originalname || file.filename}
          secondary={
            <>
              {file.description || "Няма описание"}
              <br />
              Качен: {new Date(file.createdAt).toLocaleString()}
            </>
          }
        />

        <IconButton onClick={(e) => handleMenuOpen(e, file)}>
          <MoreVertIcon />
        </IconButton>
      </ListItemButton>
    ));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<ExpandAllIcon />}
            onClick={expandAll}
          >
            Expand All
          </Button>

          <Button
            variant="outlined"
            startIcon={<CollapseAllIcon />}
            onClick={collapseAll}
          >
            Collapse All
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <List>
          {Object.entries(groupedFiles).map(([companyName, departments]) => {
            const companyKey = companyName;

            return (
              <Box key={companyKey}>
                <ListItemButton onClick={() => toggleExpand(companyKey)}>
                  <ListItemIcon>
                    {expanded[companyKey] ? <FolderOpenIcon /> : <FolderIcon />}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1}>
                        <CompanyIcon />
                        <Typography fontWeight="bold">{companyName}</Typography>
                      </Stack>
                    }
                  />

                  <Typography sx={{ mr: 2 }}>
                    (
                    {
                      Object.values(departments)
                        .flatMap((p) => Object.values(p))
                        .flatMap((p) => Object.values(p))
                        .flat().length
                    }
                    )
                  </Typography>

                  {expanded[companyKey] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={expanded[companyKey]}>
                  <List component="div">
                    {Object.entries(departments).map(
                      ([departmentName, products]) => {
                        const departmentKey = `${companyKey}-${departmentName}`;

                        return (
                          <Box key={departmentKey}>
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => toggleExpand(departmentKey)}
                            >
                              <ListItemIcon>
                                {expanded[departmentKey] ? (
                                  <FolderOpenIcon />
                                ) : (
                                  <FolderIcon />
                                )}
                              </ListItemIcon>

                              <ListItemText
                                primary={
                                  <Stack direction="row" spacing={1}>
                                    <DepartmentIcon />
                                    <Typography>{departmentName}</Typography>
                                  </Stack>
                                }
                              />

                              {expanded[departmentKey] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </ListItemButton>

                            <Collapse in={expanded[departmentKey]}>
                              <List component="div">
                                {Object.entries(products).map(
                                  ([productName, productTypes]) => {
                                    const productKey = `${departmentKey}-${productName}`;

                                    return (
                                      <Box key={productKey}>
                                        <ListItemButton
                                          sx={{
                                            pl: 7,
                                          }}
                                          onClick={() =>
                                            toggleExpand(productKey)
                                          }
                                        >
                                          <ListItemIcon>
                                            <ProductIcon />
                                          </ListItemIcon>

                                          <ListItemText primary={productName} />

                                          {expanded[productKey] ? (
                                            <ExpandLess />
                                          ) : (
                                            <ExpandMore />
                                          )}
                                        </ListItemButton>

                                        <Collapse in={expanded[productKey]}>
                                          <List component="div">
                                            {Object.entries(productTypes).map(
                                              ([type, typeFiles]) => {
                                                const typeKey = `${productKey}-${type}`;

                                                return (
                                                  <Box key={typeKey}>
                                                    <ListItemButton
                                                      sx={{
                                                        pl: 9,
                                                      }}
                                                      onClick={() =>
                                                        toggleExpand(typeKey)
                                                      }
                                                    >
                                                      <ListItemIcon>
                                                        <ProductTypeIcon />
                                                      </ListItemIcon>

                                                      <ListItemText
                                                        primary={`${type} (${typeFiles.length})`}
                                                      />

                                                      {expanded[typeKey] ? (
                                                        <ExpandLess />
                                                      ) : (
                                                        <ExpandMore />
                                                      )}
                                                    </ListItemButton>

                                                    <Collapse
                                                      in={expanded[typeKey]}
                                                    >
                                                      <List>
                                                        {renderFiles(typeFiles)}
                                                      </List>
                                                    </Collapse>
                                                  </Box>
                                                );
                                              },
                                            )}
                                          </List>
                                        </Collapse>
                                      </Box>
                                    );
                                  },
                                )}
                              </List>
                            </Collapse>
                          </Box>
                        );
                      },
                    )}
                  </List>
                </Collapse>

                <Divider sx={{ my: 1 }} />
              </Box>
            );
          })}
        </List>

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
