import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserOrders.css"; // Unique CSS file

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("activeUser"));

    useEffect(() => {
        if (!user) {
            alert("You must be logged in to view your orders.");
            navigate("/");
            return;
        }

        // Fetch user orders
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/orders/${user.userId}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="userorders-page">
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p className="userorders-empty">You have no orders yet.</p>
            ) : (
                <div className="userorders-container">
                    {orders.map((order) => (
                        <div key={order._id} className="userorders-card">
                            <h2>Order Date: {new Date(order.orderDate).toLocaleString()}</h2>
                            <p className="userorders-total">Total: ${order.totalAmount.toFixed(2)}</p>
                            <div className="userorders-products">
                                {order.products.map((product, index) => (
                                    <div key={index} className="userorders-product">
                                        <img src={product.image} alt={product.name} />
                                        <div className="userorders-details">
                                            <h3>{product.name}</h3>
                                            <p>Quantity: {product.quantity}</p>
                                            <p>Price: ${parseFloat(product.cost / product.quantity).toFixed(2)}</p>
                                            <p>Subtotal: ${parseFloat(product.cost).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="userorders-back" onClick={() => navigate("/mainpage")}>
                Back to Shop
            </button>
        </div>
    );
};

export default UserOrders;
