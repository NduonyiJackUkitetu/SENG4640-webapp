import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountPage.css";

const AccountPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        role: ""
    });

    useEffect(() => {
        const activeUser = JSON.parse(localStorage.getItem("activeUser"));

        if (activeUser) {
            setUser(activeUser);
        } else {
            alert("No account found. Please log in.");
            navigate("/");
        }
    }, [navigate]);

    // Handle input changes
    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    // Handle Save Changes
    const handleSaveChanges = () => {
        localStorage.setItem("activeUser", JSON.stringify(user));
        alert("Account details updated successfully!");
    };

    // Handle Cancel
    const handleCancelChanges = () => {
        navigate("/mainpage");
    };

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("activeUser");
        navigate("/");
    };

    return (
        <div className="accountpage-container">
            <h2>Account Information</h2>

            <form>
                <label htmlFor="fullName">Full Name:</label>
                <input type="text" name="fullName" value={user.fullName} onChange={handleChange} />

                <label htmlFor="address">Address:</label>
                <input type="text" name="address" value={user.address} onChange={handleChange} />

                <label htmlFor="city">City:</label>
                <input type="text" name="city" value={user.city} onChange={handleChange} />

                <label htmlFor="state">State:</label>
                <input type="text" name="state" value={user.state} onChange={handleChange} />

                <label htmlFor="zip">Zip Code:</label>
                <input type="text" name="zip" value={user.zip} onChange={handleChange} />

                <label htmlFor="role">Role:</label>
                <input type="text" name="role" value={user.role} readOnly />

                <div className="accountpage-buttons">
                    <button type="button" onClick={handleSaveChanges}>Save Changes</button>
                    <button type="button" onClick={handleCancelChanges}>Cancel</button>
                    <button type="button" onClick={handleLogout}>Log Out</button>
                </div>
            </form>
        </div>
    );
};

export default AccountPage;
