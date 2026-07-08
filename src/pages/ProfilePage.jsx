import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/auth";
import {
  getAddresses,
  createAddress,
  deleteAddress,
  changePassword,
  deleteAccount,
} from "../api/auth";
import toast from "react-hot-toast";
import { User, MapPin, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, setUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("account");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "",
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    is_default: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.data);
      } catch {
        toast.error("Failed to load addresses");
      } finally {
        setLoadingAddresses(false);
      }
    };
    init();
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      setUser(res.data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async () => {
    setSavingAddress(true);
    try {
      const res = await createAddress(addressForm);
      setAddresses([...addresses, res.data]);
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
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleChangePassword = async () => {
    setPasswordErrors({});
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordErrors({ confirm_password: "Passwords do not match." });
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast.success("Password updated successfully");
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setPasswordErrors(err.response?.data || {});
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeletingAccount(true);
    try {
      await deleteAccount({ password: deletePassword });
      logoutUser();
      navigate("/");
      toast.success("Account deleted");
    } catch (err) {
      setDeleteError(err.response?.data?.password || "Incorrect password.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-olive-100 flex items-center justify-center">
            <User size={24} className="text-olive-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-beige-800">
              {user?.username}
            </h1>
            <p className="text-beige-400 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-1 bg-beige-100 rounded-full p-1 mb-8 w-fit">
          {["account", "addresses", "security"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm transition-colors capitalize ${
                tab === t
                  ? "bg-white text-olive-600 shadow-sm font-medium"
                  : "text-beige-500 hover:text-beige-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* account tab */}
        {tab === "account" && (
          <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="text-base font-semibold text-beige-800">
              Account Details
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-beige-500 uppercase tracking-widest">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-beige-500 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/orders"
                className="text-sm text-olive-500 hover:text-olive-700 transition-colors"
              >
                View my orders →
              </Link>
              <button
                onClick={handleProfileSave}
                disabled={saving}
                className="bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white px-8 py-2.5 rounded-full text-sm transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* addresses tab */}
        {tab === "addresses" && (
          <div className="flex flex-col gap-4">
            {loadingAddresses ? (
              <div className="bg-beige-100 rounded-2xl h-32 animate-pulse" />
            ) : (
              <>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-beige-50 border border-beige-200 rounded-2xl p-5 flex items-start justify-between"
                  >
                    <div className="flex gap-3">
                      <MapPin
                        size={16}
                        className="text-olive-500 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-beige-800">
                          {addr.full_name}
                          {addr.label && (
                            <span className="ml-2 text-xs text-olive-500 bg-olive-50 border border-olive-200 px-2 py-0.5 rounded-full">
                              {addr.label}
                            </span>
                          )}
                          {addr.is_default && (
                            <span className="ml-2 text-xs text-beige-400 bg-beige-100 px-2 py-0.5 rounded-full">
                              Default
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
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-beige-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 text-sm text-olive-500 hover:text-olive-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add new address
                  </button>
                )}

                {showAddressForm && (
                  <div className="bg-beige-50 border border-beige-200 rounded-2xl p-5 flex flex-col gap-4">
                    {[
                      {
                        name: "label",
                        placeholder: "Label (e.g. Home, Office)",
                      },
                      { name: "full_name", placeholder: "Full name" },
                      { name: "phone", placeholder: "Phone number" },
                      { name: "street_address", placeholder: "Street address" },
                      { name: "city", placeholder: "City" },
                      { name: "state", placeholder: "State" },
                    ].map((field) => (
                      <input
                        key={field.name}
                        type="text"
                        placeholder={field.placeholder}
                        value={addressForm[field.name]}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            [field.name]: e.target.value,
                          })
                        }
                        className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                      />
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
                        onClick={handleAddressSubmit}
                        disabled={savingAddress}
                        className="flex-1 bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white rounded-full py-2.5 text-sm transition-colors"
                      >
                        {savingAddress ? "Saving..." : "Save Address"}
                      </button>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 border border-beige-300 text-beige-700 rounded-full py-2.5 text-sm hover:border-olive-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === "security" && (
          <div className="flex flex-col gap-6">
            {/* change password */}
            <div className="bg-beige-50 border border-beige-200 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-base font-semibold text-beige-800">
                Change Password
              </h2>

              {[
                { name: "current_password", placeholder: "Current password" },
                { name: "new_password", placeholder: "New password" },
                {
                  name: "confirm_password",
                  placeholder: "Confirm new password",
                },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs text-beige-500 uppercase tracking-widest">
                    {field.placeholder}
                  </label>
                  <input
                    type="password"
                    value={passwordForm[field.name]}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        [field.name]: e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    className="border border-beige-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-olive-400"
                  />
                  {passwordErrors[field.name] && (
                    <p className="text-red-400 text-xs">
                      {passwordErrors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="self-start bg-olive-500 hover:bg-olive-600 disabled:opacity-60 text-white px-8 py-2.5 rounded-full text-sm transition-colors"
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>

            {/* delete account */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-base font-semibold text-red-600">
                Delete Account
              </h2>
              <p className="text-sm text-red-400">
                This action is permanent and cannot be undone. All your orders
                and data will be deleted.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="self-start border border-red-300 text-red-500 hover:bg-red-500 hover:text-white px-8 py-2.5 rounded-full text-sm transition-colors"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password to confirm"
                    className="border border-red-300 rounded-lg px-4 py-2.5 text-sm text-beige-800 bg-white focus:outline-none focus:border-red-400"
                  />
                  {deleteError && (
                    <p className="text-red-400 text-xs">{deleteError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                      className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-full py-2.5 text-sm transition-colors"
                    >
                      {deletingAccount
                        ? "Deleting..."
                        : "Yes, delete my account"}
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                        setDeleteError("");
                      }}
                      className="flex-1 border border-beige-300 text-beige-700 rounded-full py-2.5 text-sm hover:border-beige-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
