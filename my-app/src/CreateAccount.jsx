import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for API calls
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
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { fullName, address, city, state, zip, password, confirmPassword, role } = formData;

        if (!fullName || !address || !city || !state || !zip || !password || !confirmPassword || !role) {
            alert("Please fill in all fields.");
            return;
        }

        if (!/^\d{5}(-\d{4})?$|^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(zip)) {
            alert("Invalid ZIP Code.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:5000/create-account", {
                fullName,
                address,
                city,
                state,
                zip,
                password,
                role,
            });

            alert(response.data.message);
            navigate("/");

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error creating account.");
        } finally {
            setLoading(false);
        }
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
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="zip">Zip Code</label>
                            <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Account Type</label>
                            <select name="role" value={formData.role} onChange={handleChange} required>
                                <option value="user">User</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                    </fieldset>

                    <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
                    <button type="button" onClick={() => navigate("/")}>Back To Login</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
