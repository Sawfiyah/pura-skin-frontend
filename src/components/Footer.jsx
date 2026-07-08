import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-beige-100 border-t border-beige-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* brand */}
          <div className="md:col-span-1">
            <img src="/pura-skin.jpg" style={{ height: "50px" }} />
            <p className="text-sm text-beige-500 leading-relaxed mb-5">
              Clean, effective skincare formulated with nature's finest
              ingredients. Your glow starts here.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-beige-400 hover:text-olive-500 transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-beige-400 hover:text-olive-500 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-beige-400 hover:text-olive-500 transition-colors"
              >
                Tiktok
              </a>
            </div>
          </div>

          {/* shop */}
          <div>
            <p className="text-xs text-beige-400 uppercase tracking-widest mb-4">
              Shop
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/products"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/products?category=cleansers"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Cleansers
              </Link>
              <Link
                to="/products?category=serums"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Serums
              </Link>
              <Link
                to="/products?category=moisturizers"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Moisturizers
              </Link>
              <Link
                to="/products?category=sunscreen"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Sunscreen
              </Link>
              <Link
                to="/products?category=masks"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Masks
              </Link>
            </div>
          </div>

          {/* account */}
          <div>
            <p className="text-xs text-beige-400 uppercase tracking-widest mb-4">
              Account
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/profile"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                My Orders
              </Link>
              <Link
                to="/cart"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Cart
              </Link>
              <Link
                to="/register"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* help */}
          <div>
            <p className="text-xs text-beige-400 uppercase tracking-widest mb-4">
              Help
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:hello@puraskin.com"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Shipping Policy
              </a>
              <a
                href="#"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Returns & Refunds
              </a>
              <a
                href="#"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-beige-600 hover:text-olive-500 transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-beige-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-beige-400">
            © {new Date().getFullYear()} Pura Skin. All rights reserved.
          </p>
          <p className="text-xs text-beige-400">
            Made with care for your skin ✦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
