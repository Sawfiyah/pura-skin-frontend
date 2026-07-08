import { useState, useEffect } from "react";
import { getAdminOrders, updateOrderStatus } from "../../api/admin";
import toast from "react-hot-toast";

const STATUS_CHOICES = ["pending", "paid", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-600",
  paid: "bg-blue-100 text-blue-600",
  shipped: "bg-purple-100 text-purple-600",
  delivered: "bg-olive-100 text-olive-600",
  cancelled: "bg-red-100 text-red-400",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders();
      setOrders(res.data.results || res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchOrders();
    };
    init();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-beige-100 rounded-2xl h-20 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-beige-800">Orders</h1>
          <p className="text-beige-400 text-sm mt-1">
            {orders.length} total orders
          </p>
        </div>

        {orders.length === 0 ? (
          <p className="text-beige-400 text-center py-20">No orders yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-beige-50 border border-beige-200 rounded-2xl overflow-hidden"
              >
                {/* order row */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-beige-100 transition-colors"
                  onClick={() =>
                    setExpandedOrder(
                      expandedOrder === order.id ? null : order.id,
                    )
                  }
                >
                  <div className="flex items-center gap-6">
                    <p className="text-sm font-semibold text-beige-800">
                      #{order.id}
                    </p>
                    <div>
                      <p className="text-sm text-beige-700">
                        {order.address?.full_name}
                      </p>
                      <p className="text-xs text-beige-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-NG",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-olive-600">
                      ₦{Number(order.total_price).toLocaleString()}
                    </p>

                    {/* status dropdown */}
                    <select
                      value={order.status}
                      disabled={updatingStatus === order.id}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className={`text-xs px-3 py-1.5 rounded-full border-0 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-olive-300 ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_CHOICES.map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-white text-beige-800"
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>

                    <span className="text-beige-300 text-xs">
                      {expandedOrder === order.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* expanded order details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-beige-200 px-5 py-4 flex flex-col gap-4">
                    {/* delivery info */}
                    <div>
                      <p className="text-xs text-beige-400 uppercase tracking-widest mb-2">
                        Delivery Address
                      </p>
                      <p className="text-sm text-beige-700">
                        {order.address?.full_name}
                      </p>
                      <p className="text-sm text-beige-500">
                        {order.address?.phone}
                      </p>
                      <p className="text-sm text-beige-500">
                        {order.address?.street_address}, {order.address?.city},{" "}
                        {order.address?.state}
                      </p>
                    </div>

                    {/* items */}
                    <div>
                      <p className="text-xs text-beige-400 uppercase tracking-widest mb-3">
                        Items
                      </p>
                      <div className="flex flex-col gap-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-beige-100 rounded-xl p-3"
                          >
                            <div className="w-10 h-10 bg-beige-200 rounded-lg overflow-hidden shrink-0">
                              {item.product?.images?.find(
                                (img) => img.is_primary,
                              ) || item.product?.images?.[0] ? (
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
                            <div className="flex-1">
                              <p className="text-sm text-beige-800 line-clamp-1">
                                {item.product?.name || "Deleted product"}
                              </p>
                              <p className="text-xs text-beige-400">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-olive-600">
                              ₦
                              {Number(
                                item.price_at_purchase * item.quantity,
                              ).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* total */}
                    <div className="flex justify-between items-center border-t border-beige-200 pt-3">
                      <p className="text-sm text-beige-500">Order Total</p>
                      <p className="text-base font-semibold text-olive-600">
                        ₦{Number(order.total_price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
