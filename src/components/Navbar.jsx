import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import { logout } from "../api/auth";
import toast from "react-hot-toast";

const SKIN_TYPES = [
  { label: "All Skin Types", value: "all" },
  { label: "Dry", value: "dry" },
  { label: "Oily", value: "oily" },
  { label: "Combination", value: "combination" },
  { label: "Sensitive", value: "sensitive" },
];

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { cartCount } = useCart();
  const { categories, brands } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // mobile filter state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("");

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      await logout({ refresh });
    } catch {
      // fail silently
    } finally {
      logoutUser();
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery.trim()}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const handleMobileFilter = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (selectedSkinType) params.set("skin_type", selectedSkinType);
    navigate(`/products?${params.toString()}`);
    setMenuOpen(false);
  };

  const handleMobileReset = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedSkinType("");
  };

  return (
    <nav className="bg-beige-50 border-b border-beige-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* back arrow */}
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="hidden md:flex items-center gap-1 text-beige-500 hover:text-olive-500 transition-colors text-sm"
          >
            ←
          </button>
        )}

        {/* logo */}
        <Link to="/">
          <img src="/pura-skin.jpg" style={{ height: "50px" }} />
        </Link>

        {/* desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-beige-700">
          <Link to="/" className="hover:text-olive-500 transition-colors">
            Home
          </Link>
          <Link
            to="/products"
            className="hover:text-olive-500 transition-colors"
          >
            Shop
          </Link>
        </div>

        {/* desktop right icons */}
        <div className="hidden md:flex items-center gap-5">
          {/* expandable search */}
          <div className="flex items-center gap-2">
            {searchOpen && (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="border border-beige-300 rounded-full px-4 py-1.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 w-52 transition-all"
                />
              </form>
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-beige-700 hover:text-olive-500 transition-colors"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {user?.is_staff && (
            <Link
              to="/admin"
              className="text-olive-500 hover:text-olive-700 transition-colors"
            >
              <LayoutDashboard size={20} />
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="text-beige-700 hover:text-olive-500 transition-colors"
              >
                <User size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-beige-700 hover:text-olive-500 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-beige-700 hover:text-olive-500 transition-colors text-sm"
            >
              Sign in
            </Link>
          )}

          <Link
            to="/cart"
            className="relative text-beige-700 hover:text-olive-500 transition-colors"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-olive-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* mobile right side */}
        <div className="md:hidden flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="text-beige-500 hover:text-olive-500 transition-colors"
            >
              ←
            </button>
          )}
          <Link to="/cart" className="relative text-beige-700">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-olive-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="text-beige-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-beige-50 border-t border-beige-200 px-4 py-5 flex flex-col gap-5">
          {/* mobile search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 border border-beige-300 rounded-full px-4 py-2 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
            />
            <button
              type="submit"
              className="bg-olive-500 text-white rounded-full p-2"
            >
              <Search size={16} />
            </button>
          </form>

          {/* mobile filters */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-beige-500 uppercase tracking-widest">
              Filter By
            </p>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-beige-300 rounded-lg px-3 py-2 text-sm text-beige-700 bg-white focus:outline-none focus:border-olive-400"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="border border-beige-300 rounded-lg px-3 py-2 text-sm text-beige-700 bg-white focus:outline-none focus:border-olive-400"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value)}
              className="border border-beige-300 rounded-lg px-3 py-2 text-sm text-beige-700 bg-white focus:outline-none focus:border-olive-400"
            >
              <option value="">All Skin Types</option>
              {SKIN_TYPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleMobileFilter}
                className="flex-1 bg-olive-500 hover:bg-olive-600 text-white rounded-full py-2 text-sm transition-colors"
              >
                View Results
              </button>
              <button
                onClick={handleMobileReset}
                className="flex-1 border border-beige-300 text-beige-700 rounded-full py-2 text-sm hover:border-olive-400 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* mobile nav links */}
          <div className="flex flex-col gap-3 border-t border-beige-200 pt-4 text-sm text-beige-700">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                {user?.is_staff && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
