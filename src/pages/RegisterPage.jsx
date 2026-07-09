import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login, getProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
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
      await register(formData);
      const loginRes = await login({
        username: formData.username,
        password: formData.password,
      });
      // save tokens FIRST before fetching profile
      localStorage.setItem("access_token", loginRes.data.access);
      localStorage.setItem("refresh_token", loginRes.data.refresh);
      const profileRes = await getProfile();
      loginUser(loginRes.data, profileRes.data);
      toast.success("Welcome to Pura Skin!");
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
            <p className="text-beige-500 text-xl">Create your account</p>
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
              placeholder="Choose a username"
              className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 transition-colors"
            />
            {errors.username && (
              <p className="text-red-400 text-xs">{errors.username}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-beige-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 transition-colors"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email}</p>
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
              placeholder="Create a password"
              className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 transition-colors"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-beige-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 transition-colors"
            />
            {errors.password2 && (
              <p className="text-red-400 text-xs">{errors.password2}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white rounded-full py-3 text-sm transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-beige-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-olive-500 hover:text-olive-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
