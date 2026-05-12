import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";

export const useProducts = (companyId, departmentId) => {
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [productNames, setProductNames] = useState([]);
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");

  const productNameDebounceRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/product-types");
        setProductTypes(response.data);
      } catch (error) {
        console.error(error);
        setError("Грешка при зареждане на продуктите.");
      }
    };

    fetchProducts();
  }, []);

  const fetchProductNames = (query = "") => {
    if (!companyId) return;

    if (productNameDebounceRef.current) {
      clearTimeout(productNameDebounceRef.current);
    }

    productNameDebounceRef.current = setTimeout(async () => {
      const params = new URLSearchParams(companyId);
      if (departmentId) {
        params.append("departmentId", departmentId);
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
    }, 300);
  };

  return {
    productTypes,
    selectedProductType,
    setSelectedProductType,
    productNames,
    productName,
    setProductName,
    error,
    fetchProductNames,
  };
};
