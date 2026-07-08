import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getOrder } from "../api/orders";
import { CheckCircle } from "lucide-react";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrder(id);
        setOrder(res.data);
      } catch {
        // order not found
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-beige-100 rounded-2xl h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-beige-400 mb-4">Order not found</p>
          <Link to="/" className="text-olive-500 hover:text-olive-700 text-sm">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* success header */}
        <div className="text-center mb-10">
          <CheckCircle size={56} className="text-olive-500 mx-auto mb-4" />
          {paymentSuccess && (
            <div className="bg-olive-50 border border-olive-200 rounded-full px-4 py-2 inline-block mb-4">
              <p className="text-olive-600 text-sm">Payment successful ✓</p>
            </div>
          )}
          <h1 className="text-3xl font-semibold text-beige-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-beige-500 text-sm">
            Thank you for shopping with Pura Skin. Your order has been placed
            successfully.
          </p>
        </div>

        {/* order details card */}
        <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6 flex flex-col gap-6">
          {/* order meta */}
          <div className="flex flex-wrap gap-4 justify-between text-sm">
            <div>
              <p className="text-beige-400 text-xs uppercase tracking-widest mb-1">
                Order ID
              </p>
              <p className="text-beige-800 font-medium">#{order.id}</p>
            </div>
            <div>
              <p className="text-beige-400 text-xs uppercase tracking-widest mb-1">
                Status
              </p>
              <span className="bg-olive-100 text-olive-600 text-xs px-3 py-1 rounded-full capitalize">
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-beige-400 text-xs uppercase tracking-widest mb-1">
                Date
              </p>
              <p className="text-beige-800 font-medium">
                {new Date(order.created_at).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* delivery address */}
          <div>
            <p className="text-beige-400 text-xs uppercase tracking-widest mb-2">
              Delivery Address
            </p>
            <div className="bg-beige-100 rounded-xl p-4 text-sm text-beige-700">
              <p className="font-medium">{order.address.full_name}</p>
              <p>{order.address.phone}</p>
              <p>
                {order.address.street_address}, {order.address.city},{" "}
                {order.address.state}
              </p>
            </div>
          </div>

          {/* order items */}
          <div>
            <p className="text-beige-400 text-xs uppercase tracking-widest mb-3">
              Items Ordered
            </p>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-beige-100 rounded-xl p-3"
                >
                  <div className="w-12 h-12 bg-beige-200 rounded-lg overflow-hidden shrink-0">
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
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-beige-300 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-beige-800 line-clamp-1">
                      {item.product?.name || "Product unavailable"}
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
          <div className="border-t border-beige-200 pt-4 flex justify-between items-center">
            <p className="text-sm text-beige-600">Total Paid</p>
            <p className="text-lg font-semibold text-olive-600">
              ₦{Number(order.total_price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/orders"
            className="flex-1 text-center border border-beige-300 text-beige-700 hover:border-olive-400 hover:text-olive-500 rounded-full py-3 text-sm transition-colors"
          >
            View All Orders
          </Link>
          <Link
            to="/products"
            className="flex-1 text-center bg-olive-500 hover:bg-olive-600 text-white rounded-full py-3 text-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
