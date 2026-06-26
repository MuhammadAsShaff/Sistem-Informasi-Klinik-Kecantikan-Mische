import { useState } from "react";
import { CITIES } from "@/core/utils/rajaOngkirData";

export const useModalTambahUser = (hook) => {
  const { formData, setFormData, showPassword, setShowPassword, handleChange, handleSubmit } = hook;

  const [localCities, setLocalCities] = useState([]);

  const fetchCities = (provinceId) => {
    if (!provinceId) {
      setLocalCities([]);
      return;
    }
    setLocalCities(CITIES[provinceId] || []);
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
    localCities,
    fetchCities
  };
};
