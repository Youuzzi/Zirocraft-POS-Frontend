import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService"; // Tambahan baru

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // State untuk Barang
  const [token, setToken] = useState(localStorage.getItem("token"));

  const loadData = async () => {
    // Pengaman Token
    if (!token || token === "[object Object]" || token === "undefined") return;

    try {
      console.log("AppContext: Sinkronisasi data...");

      // Ambil Kategori dan Item secara paralel (barengan)
      const [resCat, resItems] = await Promise.all([
        fetchCategories(),
        fetchItems(),
      ]);

      if (resCat.data) setCategories(resCat.data);
      if (resItems.data) {
        setProducts(resItems.data);
        console.log("AppContext: Data barang berhasil dimuat!", resItems.data);
      }
    } catch (err) {
      console.error("AppContext: Gagal sinkronisasi data.", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const contextValue = {
    categories,
    setCategories,
    products,
    setProducts,
    token,
    setToken,
    loadData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
