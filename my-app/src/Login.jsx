import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle Login
    const handleLogin = async (event) => {
        event.preventDefault();
        setError(""); // Clear previous errors

        if (!username.trim() || !password.trim()) {
            setError("Please enter your username and password.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/login", {
                username,
                password,
            });

            if (response.status === 200) {
                sessionStorage.setItem("activeUser", JSON.stringify(response.data.user)); // Store user in session storage
                navigate("/mainpage"); // Redirect to main page
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Try again.");
        }
    };

    // Redirect to Create Account Page
    const handleCreateAccount = () => {
        navigate("/createAccount");
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                    <button type="button" onClick={handleCreateAccount}>
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
