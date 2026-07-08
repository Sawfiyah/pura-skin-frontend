import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { updateCartItem, deleteCartItem, clearCart } from "../api/cart";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag } from "lucide-react";
import { getImageUrl } from "../utils/image";

const CartPage = () => {
  const { cart, fetchCart, cartLoading } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await updateCartItem(itemId, { quantity: newQuantity });
      await fetchCart();
    } catch (err) {
      toast.error(
        err.response?.data?.quantity?.[0] || "Failed to update quantity",
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (itemId) => {
    setUpdating(itemId);
    try {
      await deleteCartItem(itemId);
      await fetchCart();
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    } finally {
      setUpdating(null);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      await fetchCart();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  if (cartLoading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-beige-100 rounded-2xl h-28 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-beige-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-beige-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-beige-400 text-sm mb-6">
            Looks like you haven't added anything yet
          </p>
          <Link
            to="/products"
            className="bg-olive-500 hover:bg-olive-600 text-white px-8 py-3 rounded-full text-sm transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-beige-800">Your Cart</h1>
          <button
            onClick={handleClear}
            className="text-xs text-beige-400 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* cart items */}
          <div className="flex-1 flex flex-col gap-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-beige-50 border border-beige-200 rounded-2xl p-4 flex gap-4"
              >
                {/* image */}
                <Link to={`/products/${item.product.slug}`}>
                  <div className="w-20 h-20 bg-beige-100 rounded-xl overflow-hidden shrink-0">
                    {item.product.images?.find((img) => img.is_primary) ||
                    item.product.images?.[0] ? (
                      <img
                        src={getImageUrl(
                          (
                            item.product.images?.find(
                              (img) => img.is_primary,
                            ) || item.product.images?.[0]
                          )?.image,
                        )}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-beige-300 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                </Link>

                {/* info */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-olive-500">
                        {item.product.brand?.name}
                      </p>
                      <Link to={`/products/${item.product.slug}`}>
                        <h3 className="text-sm font-medium text-beige-800 hover:text-olive-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={updating === item.id}
                      className="text-beige-300 hover:text-red-400 transition-colors ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* quantity controls */}
                    <div className="flex items-center border border-beige-300 rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        disabled={updating === item.id || item.quantity <= 1}
                        className="px-3 py-1 text-beige-700 hover:bg-beige-100 transition-colors disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm text-beige-800">
                        {updating === item.id ? "..." : item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={updating === item.id}
                        className="px-3 py-1 text-beige-700 hover:bg-beige-100 transition-colors disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-olive-600">
                      ₦{Number(item.subtotal).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* order summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6 sticky top-24">
              <h2 className="text-base font-semibold text-beige-800 mb-5">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 text-sm text-beige-600 mb-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{Number(cart.total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-olive-500">Calculated at checkout</span>
                </div>
                <div className="border-t border-beige-200 pt-3 flex justify-between font-semibold text-beige-800">
                  <span>Total</span>
                  <span>₦{Number(cart.total).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-olive-500 hover:bg-olive-600 text-white rounded-full py-3 text-sm transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-sm text-beige-400 hover:text-olive-500 transition-colors mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
