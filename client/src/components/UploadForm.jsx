import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
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
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";

const UploadForm = () => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [productNames, setProductNames] = useState([]);
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadController, setUploadController] = useState(null);
  const [progress, setProgress] = useState(0);

  const productNameDebounceRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, productTypesRes] = await Promise.all([
          axiosInstance.get("/companies"),
          axiosInstance.get("/product-types"),
        ]);

        setCompanies(companiesRes.data);
        setProductTypes(productTypesRes.data);
      } catch (error) {
        console.error(error);
        setError("Грешка при зареждане на данните.");
      }
    };

    fetchData();
  }, []);

  const fetchProductNames = async (query = "") => {
    if (!selectedCompany) {
      setProductNames([]);
      return;
    }

    try {
      const params = new URLSearchParams({ companyId: selectedCompany });
      if (selectedDepartment) {
        params.append("departmentId", selectedDepartment);
      }
      if (query) {
        params.append("q", query);
      }

      const res = await axiosInstance.get(
        `/admin/files/products?${params.toString()}`,
      );
      const names = Array.isArray(res.data.data)
        ? res.data.data.map((item) => item.productName || item)
        : [];
      setProductNames(names);
    } catch (error) {
      console.error("Грешка при зареждане на имената на продуктите:", error);
      setProductNames([]);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchProductNames();
    } else {
      setProductNames([]);
    }

    return () => {
      if (productNameDebounceRef.current) {
        clearTimeout(productNameDebounceRef.current);
      }
    };
  }, [selectedCompany, selectedDepartment]);

  const handleCompanyChange = async (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSelectedDepartment("");

    // Зареждане на отделите за избраната фирма
    const company = companies.find((c) => c.id === parseInt(companyId));
    setDepartments(company ? company.Departments : []);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

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
          onUploadProress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percentCompleted);
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
      setProgress(0);
      setMessage("Качването беше отменено.");
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setProgress(0);

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
    formData.append("description", description);
    formData.append("companyId", selectedCompany);
    if (selectedDepartment) {
      formData.append("departmentId", selectedDepartment);
    }
    formData.append("productType", selectedProductType);
    formData.append("productName", productName);

    try {
      const res = await uploadFiles(formData);

      setMessage("Файлът е качен успешно.");
      setFiles([]);
      setDescription("");
      setSelectedCompany("");
      setSelectedDepartment("");
      setDepartments([]);
      setProgress(0);

      // Пренасочване към страницата с файлове след успешното качване
      setTimeout(() => {
        navigate("/admin/files", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Грешка при качване на файла:", error);
      const errorMsg =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Грешка при качване на файла.";
      setError(errorMsg);
      setProgress(0);
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack direction="row" justifyContent="flex-start" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ minWidth: "100px" }}
          onClick={() => navigate("/admin/dashboard")}
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
        <Typography variant="h6" component="h2" sx={{ mb: 4 }} gutterBottom>
          Избор на файлове за качване
        </Typography>

        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          fullWidth
          sx={{ mb: 2 }}
        >
          Избери файлове за качване
          <input
            type="file"
            onChange={handleFileChange}
            hidden
            required
            multiple
          />
        </Button>

        {files.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography>Избрани файлове ({files.length}):</Typography>

            {files.map((file, index) => (
              <Typography key={index} variant="body2">
                {file.name}
              </Typography>
            ))}
          </Box>
        )}

        <Autocomplete
          options={companies}
          getOptionLabel={(option) => option.companyName}
          value={companies.find((c) => c.id === selectedCompany) || null}
          onChange={(event, newValue) => {
            const companyId = newValue ? newValue.id : "";
            setSelectedCompany(companyId);
            setSelectedDepartment("");
            const company = companies.find((c) => c.id === parseInt(companyId));
            setDepartments(company ? company.Departments : []);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Избери фирма"
              variant="standard"
              fullWidth
              required
            />
          )}
        />

        {departments.length > 0 && (
          <Autocomplete
            options={departments}
            getOptionLabel={(option) => option.departmentName}
            value={departments.find((d) => d.id === selectedDepartment) || null}
            onChange={(event, newValue) => {
              const departmentId = newValue ? newValue.id : "";
              setSelectedDepartment(departmentId);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Избери отдел"
                variant="standard"
                fullWidth
                required
              />
            )}
          />
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="product-type-label">
            <CategoryIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Избери тип на файла
          </InputLabel>
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
          onInputChange={(event, newInputValue) => {
            setProductName(newInputValue);

            if (!selectedCompany) {
              setProductNames([]);
              return;
            }

            if (productNameDebounceRef.current) {
              clearTimeout(productNameDebounceRef.current);
            }

            productNameDebounceRef.current = setTimeout(() => {
              fetchProductNames(newInputValue);
            }, 300);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Избери или въведи име на продукт"
              variant="standard"
              fullWidth
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
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption">{progress}%</Typography>
          </Box>
        )}

        {uploading && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={cancelUpload}
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
