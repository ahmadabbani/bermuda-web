import { StrictMode } from "react";
import axios from "axios";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import "./App.css";
import App from "./App.jsx";
// Set default headers before creating root
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
