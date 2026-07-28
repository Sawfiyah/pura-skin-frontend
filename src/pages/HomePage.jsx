import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { Leaf, Droplets, Shield, Sparkles } from "lucide-react";
import background from "../assets/background1.jpg";

const values = [
  { icon: <Leaf size={20} />, label: "Curated Brands" },
  { icon: <Droplets size={20} />, label: "Authentic Products" },
  { icon: <Shield size={20} />, label: "Secure Shopping" },
  { icon: <Sparkles size={20} />, label: "Expert Picks" },
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
      <section className="relative h-[90vh] min-h-[580px] flex items-center justify-center overflow-hidden">
        {/* background image */}
        <img
          src={background}
          alt="Skincare hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <p className="text-beige-200 text-xs tracking-[0.3em] uppercase mb-5">
            Premium Skincare Retail
          </p>
          <h1
            className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            The best brands, <br />
            <span className="text-beige-300 italic">all in one place.</span>
          </h1>
          <p className="text-beige-200 max-w-md mx-auto mb-10 text-sm leading-relaxed">
            Pura Skin brings you the world's most trusted skincare brands,
            carefully curated for every skin type and concern.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/products"
              className="bg-white hover:bg-beige-100 text-olive-700 px-8 py-3 rounded-full text-sm font-medium transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/products"
              className="border border-white/60 text-white hover:bg-white/10 px-8 py-3 rounded-full text-sm transition-colors"
            >
              Explore Products
            </Link>
          </div>
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
