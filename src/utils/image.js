const BASE_URL = import.meta.env.VITE_MEDIA_URL || "http://127.0.0.1:8000";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/media")) return `${BASE_URL}${path}`;
  return `${BASE_URL}/media/${path}`;
};
