import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../api/products";
import { addToCart } from "../api/cart";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { ShoppingBag, Leaf } from "lucide-react";
// import { getImageUrl } from "../utils/image";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProduct(slug);
        console.log("product images:", res.data.images);
        setProduct(res.data);
        const primary =
          res.data.images?.find((img) => img.is_primary) ||
          res.data.images?.[0];
        setSelectedImage(primary);
      } catch {
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await addToCart({ product_id: product.id, quantity });
      await fetchCart();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-beige-100 rounded-2xl aspect-square animate-pulse" />
            <div className="flex flex-col gap-4">
              <div className="bg-beige-100 h-8 rounded-lg animate-pulse w-3/4" />
              <div className="bg-beige-100 h-4 rounded-lg animate-pulse w-1/4" />
              <div className="bg-beige-100 h-24 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* images */}
          <div className="flex flex-col gap-4">
            <div className="bg-beige-100 rounded-2xl overflow-hidden aspect-square">
              {selectedImage ? (
                <img
                  src={selectedImage.image}
                  alt={selectedImage.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-beige-300 text-sm">
                  No image
                </div>
              )}
            </div>

            {/* image thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage?.id === img.id
                        ? "border-olive-500"
                        : "border-beige-200 hover:border-beige-400"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={img.alt_text || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* product info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-olive-500 text-sm mb-1">
                {product.brand?.name}
              </p>
              <h1 className="text-2xl font-semibold text-beige-800 mb-1">
                {product.name}
              </h1>
              <p className="text-beige-400 text-sm">{product.category?.name}</p>
            </div>

            <p className="text-2xl font-semibold text-olive-600">
              ₦{Number(product.price).toLocaleString()}
            </p>

            {/* tags */}
            <div className="flex flex-wrap gap-2">
              {product.skin_type && (
                <span className="bg-beige-100 text-beige-600 text-xs px-3 py-1 rounded-full">
                  {product.skin_type === "all"
                    ? "All Skin Types"
                    : `${product.skin_type} skin`}
                </span>
              )}
              {product.volume_ml && (
                <span className="bg-beige-100 text-beige-600 text-xs px-3 py-1 rounded-full">
                  {product.volume_ml}ml
                </span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="bg-olive-100 text-olive-600 text-xs px-3 py-1 rounded-full">
                  Only {product.stock} left
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-beige-200 text-beige-500 text-xs px-3 py-1 rounded-full">
                  Out of stock
                </span>
              )}
            </div>

            <p className="text-beige-600 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* ingredients */}
            {product.ingredients && (
              <div className="bg-beige-50 border border-beige-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf size={14} className="text-olive-500" />
                  <p className="text-xs font-medium text-beige-700 uppercase tracking-widest">
                    Key Ingredients
                  </p>
                </div>
                <p className="text-sm text-beige-600 leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}

            {/* quantity and add to cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-beige-300 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-beige-700 hover:bg-beige-100 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="px-4 text-sm text-beige-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-4 py-2 text-beige-700 hover:bg-beige-100 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 flex items-center justify-center gap-2 bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white rounded-full py-3 text-sm transition-colors"
                >
                  <ShoppingBag size={16} />
                  {adding ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
