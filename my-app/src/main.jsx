import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // Import your login component
import MainPage from "./MainPage"; // Adjust as needed
import CreateAccount from "./CreateAccount"; // Adjust as needed
import Cart from "./Cart";
import Checkout from "./Checkout";
import "./Login.css"; // Ensure CSS is included
import "./CreateAccount.css"; // Ensure CSS is included
import "./Cart.css"; // Ensure CSS is included

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
