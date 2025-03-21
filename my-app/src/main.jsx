import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // Import your login component
import MainPage from "./MainPage"; // Adjust as needed
import CreateAccount from "./CreateAccount"; // Adjust as needed
import Cart from "./Cart";
import Checkout from "./Checkout";
import CreateProduct from "./CreateProduct";
import ModifyProduct from "./ModifyProduct";
import AccountPage from "./AccountPage";
import ManagementPage from "./ManagementPage";
import UserOrders from "./UserOrders";
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
        <Route path="/createProduct" element={<CreateProduct />} />
        <Route path="/modifyProduct" element={<ModifyProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/managementPage" element={<ManagementPage />} />
        <Route path="/userOrders" element={<UserOrders />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
