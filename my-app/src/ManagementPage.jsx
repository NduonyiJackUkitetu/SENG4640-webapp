import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManagementPage.css";

const ManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const activeUser = JSON.parse(sessionStorage.getItem("activeUser"));

        if (!activeUser) {
            alert("You must be logged in as an admin to view admin.");
            navigate("/");
            return;
        }
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get("http://localhost:5000/users");
                const ordersResponse = await axios.get("http://localhost:5000/orders");

                setUsers(usersResponse.data);
                setOrders(ordersResponse.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="admin-container">
            <button className="back-button" onClick={() => navigate("/mainpage")}>
                ← Back to Main Page
            </button>
            <h1 className="admin-header">Admin Management Dashboard</h1>

            {loading ? (
                <p className="admin-loading">Loading data...</p>
            ) : error ? (
                <p className="admin-error">{error}</p>
            ) : (
                <>
                    {/* Users Section */}
                    <div className="admin-section">
                        <h2 className="admin-subheader">Users</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Full Name</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>ZIP</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.userId}</td>
                                        <td>{user.fullName}</td>
                                        <td>{user.address}</td>
                                        <td>{user.city}</td>
                                        <td>{user.state}</td>
                                        <td>{user.zip}</td>
                                        <td className={user.role === "admin" ? "admin-badge" : ""}>{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Orders Section */}
                    <div className="admin-section">
                        <h2 className="admin-subheader">Orders</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User ID</th>
                                    <th>Date</th>
                                    <th>Total Amount</th>
                                    <th>Products</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.userId}</td>
                                        <td>{new Date(order.orderDate).toLocaleString()}</td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <ul className="admin-product-list">
                                                {order.products.map((product, index) => (
                                                    <li key={index} className="admin-product-item">
                                                        <img src={product.image} alt={product.name} className="admin-product-image" />
                                                        <div>
                                                            <strong>{product.name}</strong> (Qty: {product.quantity}) - ${product.cost.toFixed(2)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ManagementPage;
