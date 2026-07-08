import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { getAddresses, createAddress } from "../api/auth";
// import { createOrder } from "../api/orders";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { MapPin, Plus, Check } from "lucide-react";
import { createCheckoutSession } from "../api/orders";

const CheckoutPage = () => {
  const { cart } = useCart();
  // const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(true);

  const [addressForm, setAddressForm] = useState({
    label: "",
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    is_default: false,
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.data);
        const defaultAddr = res.data.find((a) => a.is_default) || res.data[0];
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
        if (res.data.length === 0) setShowAddressForm(true);
      } catch {
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    setAddressErrors({ ...addressErrors, [e.target.name]: "" });
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    try {
      const res = await createAddress(addressForm);
      setAddresses([...addresses, res.data]);
      setSelectedAddress(res.data.id);
      setShowAddressForm(false);
      setAddressForm({
        label: "",
        full_name: "",
        phone: "",
        street_address: "",
        city: "",
        state: "",
        is_default: false,
      });
      toast.success("Address saved");
    } catch (err) {
      setAddressErrors(err.response?.data || {});
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    setPlacingOrder(true);
    try {
      const res = await createCheckoutSession({ address_id: selectedAddress });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to initiate checkout");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-cream min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-beige-100 rounded-2xl h-64 animate-pulse" />
            <div className="bg-beige-100 rounded-2xl h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-beige-800 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* left — delivery address */}
          <div className="flex-1 flex flex-col gap-5">
            <h2 className="text-base font-semibold text-beige-800 flex items-center gap-2">
              <MapPin size={16} className="text-olive-500" />
              Delivery Address
            </h2>

            {/* saved addresses */}
            {addresses.length > 0 && (
              <div className="flex flex-col gap-3">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`text-left border rounded-2xl p-4 transition-all ${
                      selectedAddress === addr.id
                        ? "border-olive-500 bg-olive-50"
                        : "border-beige-200 bg-beige-50 hover:border-beige-400"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-beige-800">
                          {addr.full_name}
                          {addr.label && (
                            <span className="ml-2 text-xs text-olive-500 bg-olive-50 border border-olive-200 px-2 py-0.5 rounded-full">
                              {addr.label}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-beige-500 mt-1">
                          {addr.phone}
                        </p>
                        <p className="text-xs text-beige-500">
                          {addr.street_address}, {addr.city}, {addr.state}
                        </p>
                      </div>
                      {selectedAddress === addr.id && (
                        <Check size={16} className="text-olive-500 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* add address button */}
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-2 text-sm text-olive-500 hover:text-olive-700 transition-colors"
              >
                <Plus size={16} />
                Add new address
              </button>
            )}

            {/* address form */}
            {showAddressForm && (
              <div className="bg-beige-50 border border-beige-200 rounded-2xl p-5 flex flex-col gap-4">
                <p className="text-sm font-medium text-beige-800">
                  New Address
                </p>

                {[
                  {
                    name: "label",
                    placeholder: "Label (e.g. Home, Office)",
                    type: "text",
                  },
                  { name: "full_name", placeholder: "Full name", type: "text" },
                  { name: "phone", placeholder: "Phone number", type: "text" },
                  {
                    name: "street_address",
                    placeholder: "Street address",
                    type: "text",
                  },
                  { name: "city", placeholder: "City", type: "text" },
                  { name: "state", placeholder: "State", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <input
                      type={field.type}
                      name={field.name}
                      value={addressForm[field.name]}
                      onChange={handleAddressChange}
                      placeholder={field.placeholder}
                      className="w-full border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400 transition-colors"
                    />
                    {addressErrors[field.name] && (
                      <p className="text-red-400 text-xs mt-1">
                        {addressErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <label className="flex items-center gap-2 text-sm text-beige-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.is_default}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        is_default: e.target.checked,
                      })
                    }
                    className="accent-olive-500"
                  />
                  Set as default address
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    className="flex-1 bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white rounded-full py-2.5 text-sm transition-colors"
                  >
                    {savingAddress ? "Saving..." : "Save Address"}
                  </button>
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 border border-beige-300 text-beige-700 rounded-full py-2.5 text-sm hover:border-olive-400 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* right — order summary */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6 sticky top-24">
              <h2 className="text-base font-semibold text-beige-800 mb-5">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 mb-5">
                {cart?.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-beige-600"
                  >
                    <span className="line-clamp-1 flex-1 mr-2">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="shrink-0">
                      ₦{Number(item.subtotal).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-beige-200 pt-4 flex flex-col gap-3 text-sm text-beige-600 mb-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{Number(cart?.total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-olive-500">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-beige-800 text-base">
                  <span>Total</span>
                  <span>₦{Number(cart?.total).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedAddress}
                className="w-full bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white rounded-full py-3 text-sm transition-colors"
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-center text-xs text-beige-400 mt-4">
                By placing your order you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
