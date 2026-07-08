import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/orders";
import { ShoppingBag } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-600",
  paid: "bg-blue-100 text-blue-600",
  shipped: "bg-purple-100 text-purple-600",
  delivered: "bg-olive-100 text-olive-600",
  cancelled: "bg-red-100 text-red-400",
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res.data.results || res.data);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-beige-100 rounded-2xl h-32 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={48} className="text-beige-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-beige-700 mb-2">
            No orders yet
          </h2>
          <p className="text-beige-400 text-sm mb-6">
            Your order history will appear here
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-beige-800 mb-8">
          My Orders
        </h1>

        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="bg-beige-50 border border-beige-200 hover:border-olive-300 rounded-2xl p-5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-beige-800">
                    Order #{order.id}
                  </p>
                  <p className="text-xs text-beige-400 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-beige-100 text-beige-500"}`}
                >
                  {order.status}
                </span>
              </div>

              {/* items preview */}
              <div className="flex items-center gap-2 mb-4">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="w-10 h-10 bg-beige-100 rounded-lg overflow-hidden border border-beige-200"
                  >
                    {item.product?.images?.find((img) => img.is_primary) ||
                    item.product?.images?.[0] ? (
                      <img
                        src={
                          (
                            item.product.images?.find(
                              (img) => img.is_primary,
                            ) || item.product.images?.[0]
                          )?.image
                        }
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-beige-200" />
                    )}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-beige-400">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-beige-400">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </p>
                <p className="text-sm font-semibold text-olive-600">
                  ₦{Number(order.total_price).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
