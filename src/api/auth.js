import api from "./axios";

export const register = (data) => api.post("/auth/register/", data);
export const login = (data) => api.post("/auth/login/", data);
export const logout = (data) => api.post("/auth/logout/", data);
export const refreshToken = (data) => api.post("/auth/token/refresh/", data);
export const getProfile = () => api.get("/auth/profile/");
export const updateProfile = (data) => api.patch("/auth/profile/", data);
export const getAddresses = () => api.get("/auth/addresses/");
export const createAddress = (data) => api.post("/auth/addresses/", data);
export const updateAddress = (id, data) =>
  api.patch(`/auth/addresses/${id}/`, data);
export const deleteAddress = (id) => api.delete(`/auth/addresses/${id}/`);
export const changePassword = (data) =>
  api.post("/auth/change-password/", data);
export const deleteAccount = (data) =>
  api.delete("/auth/delete-account/", { data });
