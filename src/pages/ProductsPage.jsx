import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";

const SKIN_TYPES = [
  { label: "All Skin Types", value: "" },
  { label: "Dry", value: "dry" },
  { label: "Oily", value: "oily" },
  { label: "Combination", value: "combination" },
  { label: "Sensitive", value: "sensitive" },
];

const ProductsPage = () => {
  const { categories, brands } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // read filters from URL
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const skinType = searchParams.get("skin_type") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (skinType) params.skin_type = skinType;

        const res = await getProducts(params);
        setProducts(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, brand, skinType]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = search || category || brand || skinType;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-beige-800 mb-1">Shop</h1>
          <p className="text-beige-500 text-sm">
            {loading ? "Loading..." : `${products.length} products found`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* desktop sidebar filters */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="flex flex-col gap-10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-beige-800">Filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-olive-500 hover:text-olive-700 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* category filter */}
              <div>
                <p className="text-xs text-beige-500 uppercase tracking-widest mb-3">
                  Category
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => updateFilter("category", "")}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      !category
                        ? "bg-olive-500 text-white"
                        : "text-beige-700 hover:bg-beige-100"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter("category", cat.slug)}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        category === cat.slug
                          ? "bg-olive-500 text-white"
                          : "text-beige-700 hover:bg-beige-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* brand filter */}
              <div>
                <p className="text-xs text-beige-500 uppercase tracking-widest mb-3">
                  Brand
                </p>
                <div className="flex flex-col gap-2 max-h-200 overflow-y-auto">
                  <button
                    onClick={() => updateFilter("brand", "")}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      !brand
                        ? "bg-olive-500 text-white"
                        : "text-beige-700 hover:bg-beige-100"
                    }`}
                  >
                    All
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateFilter("brand", b.slug)}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        brand === b.slug
                          ? "bg-olive-500 text-white"
                          : "text-beige-700 hover:bg-beige-100"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* skin type filter */}
              <div>
                <p className="text-xs text-beige-500 uppercase tracking-widest mb-3">
                  Skin Type
                </p>
                <div className="flex flex-col gap-2">
                  {SKIN_TYPES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateFilter("skin_type", s.value)}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        skinType === s.value
                          ? "bg-olive-500 text-white"
                          : "text-beige-700 hover:bg-beige-100"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* main content */}
          <div className="flex-1">
            {/* mobile filter toggle */}
            <div className="md:hidden flex items-center justify-between mb-4">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 border border-beige-300 text-beige-700 rounded-full px-4 py-2 text-sm hover:border-olive-400 transition-colors"
              >
                <SlidersHorizontal size={15} />
                Filters
                {hasActiveFilters && (
                  <span className="bg-olive-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-olive-500"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>

            {/* mobile filter panel */}
            {filtersOpen && (
              <div className="md:hidden bg-beige-50 border border-beige-200 rounded-2xl p-4 mb-6 flex flex-col gap-4">
                <select
                  value={category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="border border-beige-300 rounded-lg px-3 py-2 text-sm text-beige-700 bg-white focus:outline-none focus:border-olive-400"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={brand}
                  onChange={(e) => updateFilter("brand", e.target.value)}
                  className="border border-beige-300 rounded-lg px-3 py-2 text-sm text-beige-700 bg-white focus:outline-none focus:border-olive-400"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.slug}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <select
                  value={skinType}
                  onChange={(e) => updateFilter("skin_type", e.target.value)}
                  className="border border-beige-300 rounded-lg px-3 py-2 text-sm text-beige-700 bg-white focus:outline-none focus:border-olive-400"
                >
                  {SKIN_TYPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* active filter tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {search && (
                  <span className="flex items-center gap-1 bg-beige-100 text-beige-700 text-xs px-3 py-1 rounded-full">
                    Search: {search}
                    <button onClick={() => updateFilter("search", "")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="flex items-center gap-1 bg-beige-100 text-beige-700 text-xs px-3 py-1 rounded-full">
                    {categories.find((c) => c.slug === category)?.name}
                    <button onClick={() => updateFilter("category", "")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {brand && (
                  <span className="flex items-center gap-1 bg-beige-100 text-beige-700 text-xs px-3 py-1 rounded-full">
                    {brands.find((b) => b.slug === brand)?.name}
                    <button onClick={() => updateFilter("brand", "")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {skinType && (
                  <span className="flex items-center gap-1 bg-beige-100 text-beige-700 text-xs px-3 py-1 rounded-full">
                    {SKIN_TYPES.find((s) => s.value === skinType)?.label}
                    <button onClick={() => updateFilter("skin_type", "")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* product grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-beige-100 rounded-2xl h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-beige-400 text-lg mb-2">No products found</p>
                <button
                  onClick={clearFilters}
                  className="text-olive-500 text-sm hover:text-olive-700"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
