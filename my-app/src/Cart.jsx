import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState({});
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Load user and fetch cart
    useEffect(() => {
        const activeUser = JSON.parse(sessionStorage.getItem("activeUser"));
        if (!activeUser) {
            alert("You must be logged in to view your cart.");
            navigate("/");
            return;
        }

        setUser(activeUser);
        fetchCart(activeUser.userId);
    }, [navigate]);

    // Fetch cart items from the database
    const fetchCart = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/cart/${userId}`);
            console.log("Cart Data:", response.data);
            setCart(response.data.products || []);

            // Fetch product details separately
            fetchProductDetails(response.data.products || []);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCart([]);
        }
    };

    // Fetch product details from the database
    const fetchProductDetails = async (cartItems) => {
        try {
            const productIds = cartItems.map(item => item.productId);
            const response = await axios.post("http://localhost:5000/products/details", { productIds });

            // Convert product list into a map (productId -> product data)
            const productMap = {};
            response.data.forEach(product => {
                productMap[product.productId] = product;
            });

            setProducts(productMap);
        } catch (error) {
            console.error("Failed to fetch product details:", error);
        }
    };

    // Update quantity in the database
    const updateQuantity = async (productId, change) => {
        try {
            const updatedCart = cart.map(item => {
                if (item.productId === productId) {
                    return { ...item, quantity: Math.max(1, item.quantity + change) };
                }
                return item;
            });

            setCart(updatedCart);

            await axios.put("http://localhost:5000/cart/update", {
                userId: user.userId,
                productId,
                quantityChange: change
            });
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    // Remove item from cart
    const removeItem = async (productId) => {
        try {
            setCart(cart.filter(item => item.productId !== productId));

            await axios.delete("http://localhost:5000/cart/remove", {
                data: { userId: user.userId, productId }
            });
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    // Calculate total price
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const product = products[item.productId];
            const itemPrice = product ? product.price : 0; // Ensure valid price
            return total + itemPrice * item.quantity;
        }, 0).toFixed(2);
    };

    // Handle checkout
    const handleCheckout = () => {
        if (cart.length > 0) {
            navigate("/checkout");
        }
    };

    // Continue shopping
    const continueShopping = () => {
        navigate("/mainpage");
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h2>Your Shopping Cart</h2>

                {cart.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.map((item, index) => {
                                const product = products[item.productId];

                                return product ? (
                                    <div key={index} className="cart-item">
                                        <img src={product.image} alt={product.name} />
                                        <div className="cart-item-details">
                                            <h4>{product.name}</h4>
                                            <p>${(product.price || 0).toFixed(2)} x {item.quantity}</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <button className="quantity-btn" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button className="quantity-btn" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                                            <button className="remove-btn" onClick={() => removeItem(item.productId)}>Remove</button>
                                        </div>
                                    </div>
                                ) : null;
                            })}
                        </div>

                        {/* Cart Footer */}
                        <div className="cart-footer">
                            <h3>Total: <span id="cart-total">${getTotalPrice()}</span></h3>
                            <button id="checkoutButton" onClick={handleCheckout} disabled={cart.length === 0}>Checkout</button>
                            <button className="continue-shopping" onClick={continueShopping}>Continue Shopping</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
