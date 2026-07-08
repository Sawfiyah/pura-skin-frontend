import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import { ShopProvider } from "./context/ShopProvider";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" />
          </CartProvider>
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
