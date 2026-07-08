import api from "./axios";

export const getCart = () => api.get("/cart/");
export const addToCart = (data) => api.post("/cart/add/", data);
export const updateCartItem = (id, data) =>
  api.patch(`/cart/items/${id}/`, data);
export const deleteCartItem = (id) => api.delete(`/cart/items/${id}/delete/`);
export const clearCart = () => api.delete("/cart/clear/");
