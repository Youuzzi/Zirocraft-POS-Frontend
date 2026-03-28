import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(
    localStorage.getItem("name") || "Administrator",
  );

  const loadData = async () => {
    if (!token || token === "[object Object]" || token === "undefined") return;

    try {
      console.log("AppContext: Menarik data terbaru...");
      const [resCat, resItems] = await Promise.all([
        fetchCategories(),
        fetchItems(),
      ]);

      if (resCat.data) setCategories(resCat.data);
      if (resItems.data) setProducts(resItems.data);

      console.log("AppContext: Sinkronisasi Berhasil!");
    } catch (err) {
      console.error("AppContext: Gagal sinkronisasi.", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // --- KUNCI PERBAIKAN: Masukkan setCategories & setProducts ke sini ---
  const contextValue = {
    categories,
    setCategories, // <-- Tambahkan ini
    products,
    setProducts, // <-- Tambahkan ini
    token,
    setToken,
    userName,
    setUserName,
    loadData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
