import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// --- BOOTSTRAP IMPORTS ---
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AppContextProvider } from "./context/AppContext.jsx";

// --- ZIRO_STUDIO SIGNATURE LOG ---
console.log(
  "%c <Z> %c ZIROCRAFT STUDIO %c v1.0 %c",
  "background:#0dcaf0; color:#000; font-weight:bold; border-radius:3px 0 0 3px; padding:3px 10px;",
  "background:#333; color:#fff; font-weight:bold; padding:3px 10px;",
  "background:#1a1a1a; color:#0dcaf0; font-weight:bold; padding:3px 10px;",
  "background:transparent",
);
console.log(
  "%cBy Yozi Heru Maulana | zirocraftid@gmail.com",
  "color:#888; font-size:10px; font-weight:600;",
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>,
);
