import { useState, useEffect } from "react";
import { getCart } from "../api/cart";
import { useAuth } from "./AuthContext";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    const initCart = async () => {
      if (user) {
        await fetchCart();
      } else {
        setCart(null);
      }
    };
    initCart();
  }, [user]);

  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, setCart, cartLoading, fetchCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
