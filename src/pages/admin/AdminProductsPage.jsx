import { useState, useEffect } from "react";
import {
  getAdminProducts,
  deleteAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  uploadProductImage,
  deleteProductImage,
  setProductImagePrimary,
} from "../../api/admin";
import { getCategories, getBrands } from "../../api/products";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
// import { getImageUrl } from "../../utils/image";

const SKIN_TYPES = [
  { label: "All Skin Types", value: "all" },
  { label: "Dry", value: "dry" },
  { label: "Oily", value: "oily" },
  { label: "Combination", value: "combination" },
  { label: "Sensitive", value: "sensitive" },
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  skin_type: "all",
  ingredients: "",
  volume_ml: "",
  is_active: true,
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageIsPrimary, setImageIsPrimary] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchData = async () => {
    try {
      const [productsRes, catsRes, brandsRes] = await Promise.all([
        getAdminProducts(),
        getCategories(),
        getBrands(),
      ]);
      setProducts(productsRes.data.results || productsRes.data);
      setCategories(catsRes.data);
      setBrands(brandsRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchData();
    };
    init();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category?.id || "",
      brand: product.brand?.id || "",
      skin_type: product.skin_type,
      ingredients: product.ingredients || "",
      volume_ml: product.volume_ml || "",
      is_active: product.is_active,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const handleImageUpload = async () => {
    if (!imageFile || !editingProduct) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("is_primary", imageIsPrimary);

      const res = await uploadProductImage(editingProduct.slug, formData);

      const newImage = {
        id: res.data.id,
        image: res.data.image,
        is_primary: res.data.is_primary,
        alt_text: res.data.alt_text,
      };

      const updatedImages = imageIsPrimary
        ? editingProduct.images
            .map((img) => ({ ...img, is_primary: false }))
            .concat(newImage)
        : [...editingProduct.images, newImage];

      setEditingProduct({ ...editingProduct, images: updatedImages });
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, images: updatedImages } : p,
        ),
      );
      setImageFile(null);
      setImageIsPrimary(false);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteProductImage(imageId);
      const updatedImages = editingProduct.images.filter(
        (img) => img.id !== imageId,
      );
      setEditingProduct({ ...editingProduct, images: updatedImages });
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, images: updatedImages } : p,
        ),
      );
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await setProductImagePrimary(imageId);
      const updatedImages = editingProduct.images.map((img) => ({
        ...img,
        is_primary: img.id === imageId,
      }));
      setEditingProduct({ ...editingProduct, images: updatedImages });
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, images: updatedImages } : p,
        ),
      );
      toast.success("Primary image updated");
    } catch {
      toast.error("Failed to update primary image");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        volume_ml: formData.volume_ml ? parseInt(formData.volume_ml) : null,
        category_id: formData.category,
        brand_id: formData.brand || null,
      };

      if (editingProduct) {
        const res = await updateAdminProduct(editingProduct.slug, payload);
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? res.data : p)),
        );
        toast.success("Product updated");
      } else {
        const res = await createAdminProduct(payload);
        setProducts([res.data, ...products]);
        toast.success("Product created");
      }
      handleCloseForm();
    } catch (err) {
      const data = err.response?.data;
      if (data) setFormErrors(data);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`))
      return;
    setDeletingId(product.id);
    try {
      await deleteAdminProduct(product.slug);
      setProducts(products.filter((p) => p.id !== product.id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-beige-100 rounded-2xl h-48 animate-pulse"
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-beige-800">Products</h1>
            <p className="text-beige-400 text-sm mt-1">
              {products.length} total products
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-olive-500 hover:bg-olive-600 text-white px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              <Plus size={16} />
              Add Product
            </button>
          )}
        </div>

        {/* product form */}
        {showForm && (
          <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-beige-800">
                {editingProduct ? "Edit Product" : "New Product"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-beige-400 hover:text-beige-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs">{formErrors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Price (₦)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                />
                {formErrors.price && (
                  <p className="text-red-400 text-xs">{formErrors.price}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                />
                {formErrors.stock && (
                  <p className="text-red-400 text-xs">{formErrors.stock}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  name="volume_ml"
                  value={formData.volume_ml}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-red-400 text-xs">{formErrors.category}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                >
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Skin Type
                </label>
                <select
                  name="skin_type"
                  value={formData.skin_type}
                  onChange={handleChange}
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                >
                  {SKIN_TYPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="accent-olive-500"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm text-beige-700 cursor-pointer"
                >
                  Active (visible to customers)
                </label>
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  rows={3}
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 resize-none"
                />
                {formErrors.description && (
                  <p className="text-red-400 text-xs">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs text-beige-500 uppercase tracking-widest">
                  Ingredients
                </label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="Key ingredients"
                  rows={2}
                  className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white px-8 py-2.5 rounded-full text-sm transition-colors"
              >
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Create Product"}
              </button>
              <button
                onClick={handleCloseForm}
                className="border border-beige-300 text-beige-700 hover:border-olive-400 px-8 py-2.5 rounded-full text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
            {/* image management — only when editing */}
            {editingProduct && (
              <div className="mt-8 border-t border-beige-200 pt-6">
                <p className="text-sm font-semibold text-beige-800 mb-4">
                  Product Images
                </p>

                {/* existing images */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {editingProduct.images?.map((img) => (
                    <div key={img.id} className="relative group w-24 h-24">
                      <img
                        src={img.image}
                        alt={img.alt_text || "product image"}
                        className="w-full h-full object-cover rounded-xl border-2 border-beige-200"
                      />
                      {img.is_primary && (
                        <span className="absolute top-1 left-1 bg-olive-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!img.is_primary && (
                          <button
                            onClick={() => handleSetPrimary(img.id)}
                            className="text-white text-xs bg-olive-500 px-2 py-1 rounded-full"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* upload new image */}
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-beige-500 uppercase tracking-widest">
                    Upload New Image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="text-sm text-beige-600"
                  />
                  <label className="flex items-center gap-2 text-sm text-beige-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageIsPrimary}
                      onChange={(e) => setImageIsPrimary(e.target.checked)}
                      className="accent-olive-500"
                    />
                    Set as primary image
                  </label>
                  <button
                    onClick={handleImageUpload}
                    disabled={!imageFile || uploadingImage}
                    className="self-start bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white px-6 py-2 rounded-full text-sm transition-colors"
                  >
                    {uploadingImage ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* products table */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-beige-300 mx-auto mb-4" />
            <p className="text-beige-400 mb-4">No products yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-olive-500 hover:bg-olive-600 text-white px-8 py-3 rounded-full text-sm transition-colors"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="bg-beige-50 border border-beige-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-200 bg-beige-100">
                  <th className="text-left px-5 py-3 text-xs text-beige-500 uppercase tracking-widest font-medium">
                    Product
                  </th>
                  <th className="text-left px-5 py-3 text-xs text-beige-500 uppercase tracking-widest font-medium hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 text-xs text-beige-500 uppercase tracking-widest font-medium">
                    Price
                  </th>
                  <th className="text-left px-5 py-3 text-xs text-beige-500 uppercase tracking-widest font-medium hidden md:table-cell">
                    Stock
                  </th>
                  <th className="text-left px-5 py-3 text-xs text-beige-500 uppercase tracking-widest font-medium hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-beige-100 last:border-0 hover:bg-beige-100 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-beige-200 rounded-lg overflow-hidden shrink-0">
                          {product.images?.find((img) => img.is_primary) ||
                          product.images?.[0] ? (
                            <img
                              src={
                                (
                                  product.images?.find(
                                    (img) => img.is_primary,
                                  ) || product.images?.[0]
                                )?.image
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-beige-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-beige-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-olive-500">
                            {product.brand?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-beige-600 hidden md:table-cell">
                      {product.category?.name}
                    </td>
                    <td className="px-5 py-4 font-semibold text-olive-600">
                      ₦{Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.stock === 0
                            ? "bg-red-100 text-red-400"
                            : product.stock <= 5
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-olive-100 text-olive-600"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of stock"
                          : `${product.stock} left`}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.is_active
                            ? "bg-olive-100 text-olive-600"
                            : "bg-beige-200 text-beige-500"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-beige-400 hover:text-olive-500 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="text-beige-400 hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
