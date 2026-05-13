import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFileUploads } from "../../hooks/useFileUploads";
import { useCompanies } from "../../hooks/useCompanies";
import { useProducts } from "../../hooks/useProducts";

import FileUploader from "./FileUploader";
import CompanySelect from "./CompanySelect";

import {
  Box,
  Button,
  Stack,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  LinearProgress,
  InputAdornment,
  Autocomplete,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";

const UploadForm = () => {
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    files,
    setFiles,
    uploading,
    uploadProgress,
    uploadFiles,
    cancelUpload,
  } = useFileUploads();

  const {
    companies,
    departments,
    selectedCompany,
    selectedDepartment,
    selectCompany,
    setSelectedDepartment,
    error: companiesError,
  } = useCompanies();

  const {
    productTypes,
    selectedProductType,
    setSelectedProductType,
    productNames,
    productName,
    setProductName,
    error: productsError,
    fetchProductNames,
  } = useProducts(selectedCompany, selectedDepartment);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (
      !files.length ||
      !selectedCompany ||
      !selectedProductType ||
      !productName
    ) {
      setError("Моля, попълнете всички задължителни полета.");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => formData.append("files", file));
    formData.append("companyId", selectedCompany);
    if (selectedDepartment) {
      formData.append("departmentId", selectedDepartment);
    }
    // formData.append("departmentId", selectedDepartment || "");
    formData.append("productType", selectedProductType);
    formData.append("productName", productName);
    formData.append("description", description);

    try {
      await uploadFiles(formData);

      files.length > 1
        ? setMessage("Файловете са качени успешно.")
        : setMessage("Файлът е качен успешно.");

      // Пренасочване към списъка с файлове
      setTimeout(() => {
        navigate("/admin/files", { replace: true });
      }, 1500);
    } catch (error) {
      console.error(error);
      setError("Грешка при качването на файловете.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack direction="row" justifyContent="flex-start" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ minWidth: "100px" }}
          onClick={() => navigate("/admin/files")}
        >
          Обратно към списъка с потребители
        </Button>
      </Stack>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          marginTop: 8,
          padding: 4,
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" element="h2" sx={{ mb: 4 }} gutterBottom>
          Избор на файлове за качване
        </Typography>

        <FileUploader files={files} setFiles={setFiles} />

        <CompanySelect
          companies={companies}
          departments={departments}
          selectedCompany={selectedCompany}
          selectedDepartment={selectedDepartment}
          setSelectedCompany={selectCompany}
          setSelectedDepartment={setSelectedDepartment}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="product-type-label">Избери тип на файла</InputLabel>
          <Select
            labelId="product-type-label"
            value={selectedProductType}
            onChange={(e) => setSelectedProductType(e.target.value)}
            variant="standard"
            required
          >
            {productTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          freeSolo
          options={productNames}
          inputValue={productName}
          onInputChange={(e, value) => {
            setProductName(value);
            fetchProductNames(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Име на продукт"
              variant="standard"
              required
              sx={{ mb: 2 }}
            />
          )}
        />

        <TextField
          placeholder="Описание (по избор)"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {uploading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption">{uploadProgress}%</Typography>
          </Box>
        )}

        {uploading && (
          <Button
            variant="outlined"
            color="error"
            onClick={cancelUpload}
            fullWidth
            sx={{ mb: 2 }}
          >
            Отмени качването
          </Button>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={uploading}
          startIcon={<UploadFileIcon />}
          sx={{ mb: 2 }}
        >
          {uploading ? "Качване..." : "Качи файл"}
        </Button>

        {message && (
          <Typography variant="body2" color="success">
            {message}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default UploadForm;
