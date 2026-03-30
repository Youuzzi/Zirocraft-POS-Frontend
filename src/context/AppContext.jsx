import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";
import { getActiveShift } from "../Service/ShiftService";
import { fetchSettings } from "../Service/SettingService";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userName, setUserName] = useState(
    localStorage.getItem("name") || "Administrator",
  );

  // --- TAMBAHKAN STATE ROLE REAKTIF ---
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const [activeShift, setActiveShift] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadData = async () => {
    if (!token || token === "[object Object]" || token === "undefined") {
      setActiveShift(null);
      setIsDataLoaded(true);
      return;
    }

    try {
      const userId = localStorage.getItem("email");
      const [resCat, resItems, resShift, resSettings] = await Promise.all([
        fetchCategories(),
        fetchItems(),
        getActiveShift(userId),
        fetchSettings(),
      ]);

      if (resCat.data) setCategories(resCat.data);
      if (resItems.data) setProducts(resItems.data);
      if (resSettings.data) setSettings(resSettings.data);

      if (
        resShift.data &&
        resShift.data.id &&
        resShift.data.status === "OPEN"
      ) {
        setActiveShift(resShift.data);
      } else {
        setActiveShift(null);
      }

      setIsDataLoaded(true);
    } catch (err) {
      console.error("AppContext Error:", err);
      setIsDataLoaded(true);
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
    userName,
    setUserName,
    role,
    setRole, // Bagikan Role
    activeShift,
    setActiveShift,
    settings,
    setSettings,
    isDataLoaded,
    loadData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
