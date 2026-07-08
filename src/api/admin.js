import api from "./axios";

export const getAdminStats = () => api.get("/orders/admin/stats/");
export const getAdminOrders = () => api.get("/orders/admin/");
export const getAdminOrder = (id) => api.get(`/orders/admin/${id}/`);
export const updateOrderStatus = (id, data) =>
  api.patch(`/orders/admin/${id}/`, data);
export const getAdminProducts = () => api.get("/admin/products/");
export const createAdminProduct = (data) => api.post("/admin/products/", data);
export const updateAdminProduct = (slug, data) =>
  api.patch(`/admin/products/${slug}/`, data);
export const deleteAdminProduct = (slug) =>
  api.delete(`/admin/products/${slug}/`);
export const uploadProductImage = (slug, formData) =>
  api.post(`/admin/products/${slug}/images/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProductImage = (id) =>
  api.delete(`/admin/images/${id}/delete/`);
export const setProductImagePrimary = (id) =>
  api.patch(`/admin/images/${id}/set-primary/`);
