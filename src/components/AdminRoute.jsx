import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();
  return user?.is_staff ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
