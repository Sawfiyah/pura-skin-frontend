import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

// admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";

// components
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-beige-400 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderConfirmationPage />} />
        </Route>

        {/* admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};

export default App;
