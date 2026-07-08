import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { Leaf, Droplets, Shield, Sparkles } from "lucide-react";

const values = [
  { icon: <Leaf size={20} />, label: "Clean Ingredients" },
  { icon: <Droplets size={20} />, label: "Deep Hydration" },
  { icon: <Shield size={20} />, label: "Dermatologist Tested" },
  { icon: <Sparkles size={20} />, label: "Visible Results" },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categories } = useShop();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await getProducts({ limit: 8 });
        setProducts(productsRes.data.results || productsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      {/* hero */}
      <section className="bg-beige-100 px-6 py-24 text-center">
        <p className="text-olive-500 text-sm tracking-widest uppercase mb-3">
          Natural Skincare
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold text-beige-800 mb-6 leading-tight">
          Your skin deserves <br />
          <span className="text-olive-500">the purest care.</span>
        </h1>
        <p className="text-beige-600 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Pura Skin offers clean, effective skincare formulated with nature's
          finest ingredients. Glow starts here.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/products"
            className="bg-olive-500 hover:bg-olive-600 text-white px-8 py-3 rounded-full text-sm transition-colors"
          >
            Shop Now
          </Link>
          <Link
            to="/products"
            className="border border-beige-400 text-beige-700 hover:border-olive-400 hover:text-olive-500 px-8 py-3 rounded-full text-sm transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </section>

      {/* values strip */}
      <section className="bg-olive-500 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8">
          {values.map((v) => (
            <div
              key={v.label}
              className="flex items-center gap-2 text-white text-sm"
            >
              {v.icon}
              <span>{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* categories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-beige-800 mb-2">
          Shop by Category
        </h2>
        <p className="text-beige-500 text-sm mb-8">
          Find exactly what your skin needs
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="bg-beige-50 border border-beige-200 hover:border-olive-400 hover:bg-olive-50 rounded-2xl p-5 text-center transition-all group"
            >
              <p className="text-beige-700 group-hover:text-olive-600 text-sm font-medium transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* featured products */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-beige-800">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-olive-500 hover:text-olive-700 text-sm transition-colors"
          >
            View all →
          </Link>
        </div>
        <p className="text-beige-500 text-sm mb-8">Our most loved formulas</p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-beige-100 rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
