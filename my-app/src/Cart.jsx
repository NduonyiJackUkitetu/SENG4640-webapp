import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    // Load cart items from localStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Update quantity
    const updateQuantity = (index, change) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity + change > 0) {
            updatedCart[index].quantity += change;
        } else {
            updatedCart.splice(index, 1);
        }
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Remove item from cart
    const removeItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Calculate total price
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            return total + parseFloat(item.price.replace("$", "")) * item.quantity;
        }, 0).toFixed(2);
    };

    // Checkout function
    const handleCheckout = () => {
        if (cart.length > 0) {
            navigate("/checkout");
        }
    };

    // Continue Shopping (Redirect to Main Page)
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
                            {cart.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>
                                        <p>{item.price} x {item.quantity}</p>
                                    </div>
                                    <div className="cart-item-controls">
                                        <button className="quantity-btn" onClick={() => updateQuantity(index, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className="quantity-btn" onClick={() => updateQuantity(index, 1)}>+</button>
                                        <button className="remove-btn" onClick={() => removeItem(index)}>Remove</button>
                                    </div>
                                </div>
                            ))}
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
