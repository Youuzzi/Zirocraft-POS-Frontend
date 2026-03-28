import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // STATE NAMA REAKTIF: Ambil dari localStorage buat awal saja
  const [userName, setUserName] = useState(
    localStorage.getItem("name") || "Administrator",
  );

  const loadData = async () => {
    if (!token || token === "[object Object]" || token === "undefined") return;
    try {
      const [resCat, resItems] = await Promise.all([
        fetchCategories(),
        fetchItems(),
      ]);
      if (resCat.data) setCategories(resCat.data);
      if (resItems.data) setProducts(resItems.data);
    } catch (err) {
      console.error("AppContext: Gagal load data awal.", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const contextValue = {
    categories,
    products,
    token,
    setToken,
    userName, // Sebarkan nama ke seluruh komponen
    setUserName, // Sebarkan fungsi update nama
    loadData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
