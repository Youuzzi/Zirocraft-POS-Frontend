import { createContext, useEffect, useState } from "react";

import { fetchCategories } from "../Service/CategoryService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  // 1. STATE (MEMORI)
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // Tetap kita simpan biar Kasir aman

  // 2. USE EFFECT (OTAKNYA)
  useEffect(() => {
    async function loadData() {
      const response = await fetchCategories();

      // Simpan hasilnya ke memori
      if (response.data) {
        setCategories(response.data);
        console.log("Sukses ambil kategori:", response.data);
      }
      // -----------------------------------------------------
    }

    loadData();
  }, []);

  // 3. BUNGKUS DATANYA
  const contextValue = {
    categories,
    setCategories,
    products, // Wajib ada buat Kasir
    setProducts, // Wajib ada buat Kasir
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
