import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";
import { getActiveShift } from "../Service/ShiftService";
import { fetchSettings } from "../Service/SettingService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  // --- 1. STATE MANAGEMENT ---
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(
    localStorage.getItem("name") || "Administrator",
  );
  const [activeShift, setActiveShift] = useState(null);
  const [settings, setSettings] = useState(null);

  // --- 2. FUNGSI SINKRONISASI DATA ---
  const loadData = async () => {
    // Pengaman: Jangan fetch kalau token belum valid
    if (!token || token === "[object Object]" || token === "undefined") {
      console.log("AppContext: Token tidak ditemukan, menunda fetch.");
      return;
    }

    try {
      console.log("AppContext: Memulai sinkronisasi data...");
      const userId = localStorage.getItem("email");

      // Ambil semua data inti secara paralel
      const [resCat, resItems, resShift, resSettings] = await Promise.all([
        fetchCategories(),
        fetchItems(),
        getActiveShift(userId),
        fetchSettings(),
      ]);

      // Set Kategori & Produk
      if (resCat.data) setCategories(resCat.data);
      if (resItems.data) setProducts(resItems.data);
      if (resSettings.data) setSettings(resSettings.data);

      // --- LOGIKA KRUSIAL: VALIDASI SHIFT ---
      // Kita cek beneran apakah ada ID dan statusnya OPEN
      if (
        resShift.data &&
        resShift.data.id &&
        resShift.data.status === "OPEN"
      ) {
        setActiveShift(resShift.data);
        console.log(
          "AppContext: Shift aktif terdeteksi (ID: " + resShift.data.id + ")",
        );
      } else {
        setActiveShift(null);
        console.log("AppContext: Tidak ada shift aktif di database.");
      }

      console.log("AppContext: Sinkronisasi Berhasil!");
    } catch (err) {
      console.error("AppContext: Error saat sinkronisasi data.", err);
      // Jika terjadi error (misal 403), pastikan shift di-set null
      setActiveShift(null);
    }
  };

  // --- 3. TRIGGER REAKTIF ---
  useEffect(() => {
    loadData();
  }, [token]);

  // --- 4. DATA DISTRIBUTION ---
  const contextValue = {
    categories,
    setCategories,
    products,
    setProducts,
    token,
    setToken,
    userName,
    setUserName,
    activeShift,
    setActiveShift,
    settings,
    setSettings,
    loadData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
