import { useState, useEffect } from "react";
import { getCategories, getBrands } from "../api/products";
import { ShopContext } from "./ShopContext";

export const ShopProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [shopLoading, setShopLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catsRes.data);
        setBrands(brandsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setShopLoading(false);
      }
    };
    fetchShopData();
  }, []);

  return (
    <ShopContext.Provider value={{ categories, brands, shopLoading }}>
      {children}
    </ShopContext.Provider>
  );
};
