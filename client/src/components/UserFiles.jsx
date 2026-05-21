import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import usePaginatedFetch from "../hooks/usePaginatedFetch";
import {
  Card,
  CardContent,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Typography,
  TextField,
  Stack,
  Box,
  Checkbox,
  Snackbar,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaginationControls from "./PaginationControls";

const UserFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState(null);

  const {
    data: files = [],
    meta = {},
    loading,
    error: fetchError,
    params,
    setPage,
    setLimit,
    setSearch,
    fetchNow,
  } = usePaginatedFetch("/user", { page: 1, limit: 10, search: "" }, [], {
    debounceMs: 300,
    autoFetch: true,
  });

  const handleSelectFile = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const handleSelectAllFiles = (files) => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.id));
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await axiosInstance.get(`/user/${fileId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename || "file");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage("Файлът е изтеглен успешно.");

      // Рефреш на списъка с файлове след изтегляне
      fetchNow({
        page: params.page,
        limit: params.limit,
        search: params.search,
      });
    } catch (error) {
      setLocalError(
        error.response?.data?.message || "Грешка при изтегляне на файла.",
      );
    }
  };

  const handleDownloadZip = async () => {
    try {
      // Имплементация за изтегляне на ZIP файл с избраните файлове
      const response = await axiosInstance.post(
        "/user/download-zip",
        { ids: selectedFiles },
        { responseType: "blob" },
      );
      console.log(response.data);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "files.zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage("Избраните файлове са изтеглени успешно.");

      setSelectedFiles([]);

      // Рефреш на списъка с файлове след изтегляне
      fetchNow({
        page: params.page,
        limit: params.limit,
        search: params.search,
      });
    } catch (error) {
      setLocalError(
        error.response?.data?.message || "Грешка при изтегляне на ZIP файл.",
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setLocalError(null);
  };

  const onPageChange = (page) => {
    setPage(page);
    fetchNow({ page, limit: params.limit, search: params.search });
  };

  const onLimitChange = (limit) => {
    setLimit(limit);
    fetchNow({ page: params.page, limit, search: params.search });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      const s = (params.search || "").trim();
      fetchNow({ search: s, page: 1 });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Card>
      <CardContent>
        {(fetchError || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError || localError}
          </Alert>
        )}

        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Файлове за изтегляне
          </Typography>

          <TextField
            size="small"
            sx={{ mb: 3, radius: 15 }}
            placeholder="Търси по име на файл..."
            variant="outlined"
            value={params.search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </Stack>

        <FormControlLabel
          control={
            <Checkbox
              checked={
                selectedFiles.length === files.length && files.length > 0
              }
              indeterminate={
                selectedFiles.length > 0 && selectedFiles.length < files.length
              }
              onChange={() => handleSelectAllFiles(files)}
            />
          }
          label="Свали всички"
        />

        <List>
          {files.length === 0 && (
            <Typography sx={{ p: 2 }}>Няма налични файлове.</Typography>
          )}

          {files.length > 0 && (
            <ListItem sx={{ py: 1, px: 0 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "48px 3fr 3fr 3fr 140px",
                  width: "100%",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Избор
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Файл
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Описание
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Последно изтеглен от
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textAlign: "right" }}
                >
                  Действие
                </Typography>
              </Box>
            </ListItem>
          )}

          {files.map((file) => (
            <React.Fragment key={file.id}>
              <ListItem sx={{ py: 1, px: 0 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "48px 3fr 3fr 3fr 140px",
                    width: "100%",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Checkbox
                      edge="start"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleSelectFile(file.id)}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <AssignmentIcon />
                    </Avatar>
                    <Typography variant="body1" fontWeight={500}>
                      {file.filename}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {file.description ? file.description : "Няма описание"}
                  </Typography>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {file.lastDownloadedBy
                        ? `Последно изтеглен от ${file.lastDownloadedBy}`
                        : "Все още не е изтеглян"}
                    </Typography>
                    {file.lastDownloadedBy && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(
                          file.lastDownloadedAt || file.updatedAt,
                        ).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(file.id, file.originalname)}
                    >
                      Свали
                    </Button>
                  </Box>
                </Box>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadZip}
            >
              Свали избраните
            </Button>
          </Box>
        )}

        <Stack sx={{ mt: 2 }}>
          <PaginationControls
            meta={{
              page: Number(params.page) || Number(meta.page) || 1,
              pageCount: Number(meta.pageCount) || 1,
              pageSize: Number(meta.pageSize) || Number(params.limit) || 10,
              total: Number(meta.total) || 0,
            }}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
          />
        </Stack>

        <Snackbar
          open={!!successMessage || !!fetchError || !!localError}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          {successMessage ? (
            <Alert
              severity="success"
              sx={{ width: "100%" }}
              onClose={handleCloseSnackbar}
            >
              {successMessage}
            </Alert>
          ) : null}
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default UserFiles;
