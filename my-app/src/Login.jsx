import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom"; // Assuming React Router is used

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            alert("Please enter your full name and password.");
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem(username.trim()));

        if (storedUser && storedUser.password === password.trim()) {
            navigate("/mainpage"); // Redirect to main page
        } else {
            alert("Invalid full name or password.");
        }
    };

    const handleCreateAccount = (event) => {
        event.preventDefault();
        navigate("/createAccount"); // Redirect to create account page
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                <form>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className="login-btn" onClick={handleLogin}>
                            Login
                        </button>
                        <button type="submit" className="create-account-btn" onClick={handleCreateAccount}>
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
