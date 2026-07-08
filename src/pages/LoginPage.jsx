import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, getProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(formData);

      // save tokens immediately
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      // now interceptor can attach token
      const profileRes = await getProfile();

      loginUser(res.data, profileRes.data);

      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const data = err.response?.data;

      if (data?.detail) {
        toast.error(data.detail);
      } else {
        setErrors(data || {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* header */}
        <div className="flex flex-col gap-5 justify-center items-center mb-8">
          <div>
            <img src="/pura-skin.jpg" style={{ height: "100px" }} />
          </div>
          <div>
            <p className="text-beige-500 text-xl">Sign in to your account</p>
          </div>
        </div>

        {/* form */}
        <div className="bg-beige-50 border border-beige-200 rounded-2xl p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-beige-700 font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 transition-colors"
            />
            {errors.username && (
              <p className="text-red-400 text-xs">{errors.username}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-beige-700 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 transition-colors"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white rounded-full py-3 text-sm transition-colors mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-beige-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-olive-500 hover:text-olive-700 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
