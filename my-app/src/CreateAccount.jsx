import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });

    const navigate = useNavigate();

    // Handle input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Validate and handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        const { fullName, address, city, state, zip, password, confirmPassword, role } = formData;

        // Validate required fields
        if (!fullName || !address || !city || !state || !zip || !password || !confirmPassword || !role) {
            alert("Please fill in all fields.");
            return;
        }

        // Validate ZIP code (must be at least 5 digits)
        if (!/^\d{5}(-\d{4})?$|^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(zip)) {
            alert("Please enter a valid ZIP or postal code (e.g., 12345, 12345-6789, A1B 2C3).");
            return;
        }
        

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        // Check if the user already exists
        if (localStorage.getItem(fullName)) {
            alert("An account with this name already exists. Please use a different name.");
            return;
        }

        // Store user data in localStorage
        const userData = { fullName, address, city, state, zip, password, role };
        localStorage.setItem(fullName, JSON.stringify(userData));

        alert("Account created successfully! Redirecting to login page...");
        navigate("/"); // Redirect to login page
    };

    return (
        <div className="createaccount-page">
            <div className="createaccount-container">
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Account Details</legend>

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="zip">Zip Code</label>
                            <input
                                type="text"
                                id="zip"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Account Type</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                                <option value="user">User</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                    </fieldset>

                    <button type="submit">Create Account</button>
                    <button type="button" onClick={() => navigate("/")}>Back To Login</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
