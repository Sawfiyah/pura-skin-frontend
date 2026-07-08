import { useState, useEffect } from "react";
import { getProfile } from "../api/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const initAuth = async () => {
      if (token) {
        getProfile()
          .then((res) => setUser(res.data))
          .catch(() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginUser = (tokens, userData) => {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
