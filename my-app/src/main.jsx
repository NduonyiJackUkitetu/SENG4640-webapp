import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login"; // Import your login component
import MainPage from "./MainPage"; // Adjust as needed
import CreateAccount from "./CreateAccount"; // Adjust as needed
import "./Login.css"; // Ensure CSS is included
import "./CreateAccount.css"; // Ensure CSS is included

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/mainpage" element={<MainPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
