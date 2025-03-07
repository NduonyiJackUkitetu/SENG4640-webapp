import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Handle Login
    const handleLogin = (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert("Please enter your username and password.");
            return;
        }

        // Retrieve stored user data
        const storedUser = JSON.parse(localStorage.getItem(username.trim()));

        if (storedUser && storedUser.password === password.trim()) {
            localStorage.setItem("activeUser", JSON.stringify(storedUser)); // Save active user
            navigate("/mainpage"); // Redirect to main page
        } else {
            alert("Invalid username or password.");
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
