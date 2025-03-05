import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createAccount.css";

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        password: "",
        confirmPassword: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { fullName, address, city, state, zip, password, confirmPassword } = formData;

        if (!fullName || !address || !city || !state || !zip || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        const zipRegex = /(^\d{5}$)|(^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$)/;
        if (!zipRegex.test(zip)) {
            alert("Please enter a valid ZIP/Postal Code (5-digit ZIP or A1B2C3 format).");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        if (localStorage.getItem(fullName)) {
            alert("An account with this name already exists. Please use a different name.");
            return;
        }

        const userData = { fullName, address, city, state, zip, password };
        localStorage.setItem(fullName, JSON.stringify(userData));
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
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="zip">Zip Code</label>
                            <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    </fieldset>
                    <button type="submit">Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
