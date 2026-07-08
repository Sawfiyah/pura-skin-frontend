import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../api/admin";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-600",
  paid: "bg-blue-100 text-blue-600",
  shipped: "bg-purple-100 text-purple-600",
  delivered: "bg-olive-100 text-olive-600",
  cancelled: "bg-red-100 text-red-400",
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-beige-100 rounded-2xl h-28 animate-pulse"
              />
            ))}
          </div>
          <div className="bg-beige-100 rounded-2xl h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: `₦${Number(stats?.total_revenue).toLocaleString()}`,
      icon: <TrendingUp size={20} className="text-olive-500" />,
      bg: "bg-olive-50 border-olive-200",
    },
    {
      label: "Total Orders",
      value: stats?.total_orders,
      icon: <ShoppingBag size={20} className="text-beige-500" />,
      bg: "bg-beige-50 border-beige-200",
    },
    {
      label: "Active Products",
      value: stats?.total_products,
      icon: <Package size={20} className="text-beige-500" />,
      bg: "bg-beige-50 border-beige-200",
    },
    {
      label: "Pending Orders",
      value: stats?.pending_orders,
      icon: <Clock size={20} className="text-yellow-500" />,
      bg: "bg-yellow-50 border-yellow-200",
    },
  ];

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-beige-800">Dashboard</h1>
            <p className="text-beige-400 text-sm mt-1">
              Welcome back, here's what's happening
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="bg-olive-500 hover:bg-olive-600 text-white px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="border border-beige-300 text-beige-700 hover:border-olive-400 hover:text-olive-500 px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`border rounded-2xl p-5 flex flex-col gap-3 ${card.bg}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-beige-500 uppercase tracking-widest">
                  {card.label}
                </p>
                {card.icon}
              </div>
              <p className="text-2xl font-semibold text-beige-800">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* low stock warning */}
        {stats?.low_stock > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3 mb-8">
            <AlertTriangle size={18} className="text-yellow-500 shrink-0" />
            <p className="text-sm text-yellow-700">
              <span className="font-semibold">{stats.low_stock} products</span>{" "}
              are running low on stock (5 or fewer units remaining).{" "}
              <Link
                to="/admin/products"
                className="underline hover:text-yellow-900"
              >
                Review products
              </Link>
            </p>
          </div>
        )}

        {/* recent orders */}
        <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-beige-800">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs text-olive-500 hover:text-olive-700 transition-colors"
            >
              View all →
            </Link>
          </div>

          {stats?.recent_orders?.length === 0 ? (
            <p className="text-beige-400 text-sm text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats?.recent_orders?.map((order) => (
                <Link
                  key={order.id}
                  to={`/admin/orders`}
                  className="flex items-center justify-between bg-beige-100 hover:bg-beige-200 rounded-xl px-4 py-3 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-beige-800">
                      #{order.id}
                    </p>
                    <p className="text-xs text-beige-400">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-beige-100 text-beige-500"}`}
                    >
                      {order.status}
                    </span>
                    <p className="text-sm font-semibold text-olive-600">
                      ₦{Number(order.total_price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
