import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { addToCart } from "../api/cart";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const primaryImage =
    product.images?.find((img) => img.is_primary) || product.images?.[0];
  const { fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/login");
      return;
    }
    if (product.stock === 0) return;
    setAdding(true);
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
      await fetchCart();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="bg-beige-50 border border-beige-200 rounded-2xl overflow-hidden hover:border-olive-300 hover:shadow-md transition-all">
        {/* image */}
        <div className="aspect-square bg-beige-100 overflow-hidden relative">
          {primaryImage ? (
            <img
              src={primaryImage.image}
              alt={primaryImage.alt_text || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-beige-300 text-xs">
              No image
            </div>
          )}
          {/* add to cart button on hover */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-olive-500 hover:text-white text-olive-600 text-xs px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap disabled:opacity-60 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <ShoppingBag size={13} />
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs text-beige-500 bg-white px-3 py-1 rounded-full border border-beige-200">
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* info */}
        <div className="p-4">
          <p className="text-xs text-olive-500 mb-1">{product.brand?.name}</p>
          <h3 className="text-sm font-medium text-beige-800 leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-olive-600 font-semibold text-sm">
              ₦{Number(product.price).toLocaleString()}
            </p>
            {product.volume_ml && (
              <p className="text-xs text-beige-400">{product.volume_ml}ml</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
