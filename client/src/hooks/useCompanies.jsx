import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get("/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error(error);
        setError("Грешка при зареждане на фирмите.");
      }
    };

    fetchCompanies();
  }, []);

  const selectCompany = async (companyId) => {
    setSelectedCompany(companyId);
    setSelectedDepartment("");

    const company = companies.find((c) => c.id === companyId);

    if (company) {
      setDepartments(company.Departments || []);
    } else {
      setDepartments([]);
    }
  };

  return {
    companies,
    departments,
    selectedCompany,
    selectedDepartment,
    selectCompany,
    setSelectedDepartment,
    error,
  };
};
