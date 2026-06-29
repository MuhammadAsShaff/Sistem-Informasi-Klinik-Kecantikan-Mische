import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import '@/assets/css/index.css'  
import { BrowserRouter } from "react-router-dom";

/**
 * =========================================================================
 * FONDASI TANAH & PILAR BANGUNAN KLINIK (main.jsx)
 * =========================================================================
 * Ibarat tiang pancang fondasi paling mendasar tempat seluruh gedung aplikasi
 * didirikan. Di sinilah peta rute jalan raya (BrowserRouter) dan cat warna dasar
 * bangunan (index.css) ditanam agar seluruh mandor dan meja lobi dapat berdiri kokoh.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
