import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BusinessIcon from "@mui/icons-material/Business";
import ApartmentIcon from "@mui/icons-material/Apartment";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [description, setDescription] = useState("");
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [progress, setProgress] = useState(0);

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

  const handleCompanyChange = async (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSelectedDepartment("");

    // Зареждане на отделите за избраната фирма
    const company = companies.find((c) => c.id === parseInt(companyId));
    setDepartments(company ? company.Departments : []);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setProgress(0);

    if (!file || !filename || !selectedCompany) {
      setError("Моля, попълнете всички задължителни полета.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    formData.append("description", description);
    formData.append("companyId", selectedCompany);
    if (selectedDepartment) {
      formData.append("departmentId", selectedDepartment);
    }
    formData.append("productType", selectedProductType);

    try {
      const res = await axiosInstance.post("/admin/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(percentCompleted);
        },
      });

      setMessage("Файлът е качен успешно.");
      setUploadedFileUrl(res.data.file.url);
      setFile(null);
      setFilename("");
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
          Избор на файл за качване
        </Typography>

        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          fullWidth
          sx={{ mb: 2 }}
        >
          Избери файл
          <input type="file" onChange={handleFileChange} hidden required />
        </Button>
        {file && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Избран файл: {file.name}
          </Typography>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="company-label">
            <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Избери фирма
          </InputLabel>
          <Select
            labelId="company-label"
            value={selectedCompany}
            onChange={handleCompanyChange}
            variant="standard"
            required
          >
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {departments.length > 0 && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="department-label">
              <ApartmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Избери отдел
            </InputLabel>
            <Select
              labelId="department-label"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              variant="standard"
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.departmentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

        {/* <FormControl>
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
        </FormControl> */}

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

        {progress > 0 && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption">{progress}%</Typography>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<UploadFileIcon />}
          sx={{ mb: 2 }}
        >
          Качи файл
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
