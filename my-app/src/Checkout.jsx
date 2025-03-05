import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });

    const navigate = useNavigate();

    // Load cart items
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // Calculate total price
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            return total + parseFloat(item.price.replace("$", "")) * item.quantity;
        }, 0).toFixed(2);
    };

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate form fields
    const validateForm = () => {
        const { fullName, address, city, state, zip, cardName, cardNumber, expiryDate, cvv } = formData;

        if (!fullName || !address || !city || !state || !zip || !cardName || !cardNumber || !expiryDate || !cvv) {
            alert("Please fill in all fields.");
            return false;
        }

        const zipRegex = /(^\d{5}$)|(^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$)/;
        if (!zipRegex.test(zip)) {
            alert("Please enter a valid ZIP/Postal Code (5-digit ZIP or A1B2C3 format).");
            return false;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
            alert("Please enter a valid 16-digit card number.");
            return false;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            alert("Please enter a valid expiry date in MM/YY format.");
            return false;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            alert("Please enter a valid CVV (3 or 4 digits).");
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        alert("Order submitted successfully!");
        localStorage.removeItem("cart");
        navigate("/mainpage"); // Redirect to main page
    };

    // Continue Shopping (Redirect to Main Page)
    const returnToShopping = () => {
        navigate("/mainpage");
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1>Checkout</h1>

                {/* Cart Items */}
                <div className="checkout-cart-container">
                    {cart.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="checkout-item">
                                <img src={item.image} alt={item.name} className="checkout-item-image" />
                                <div className="checkout-item-details">
                                    <h2 className="checkout-item-title">{item.name}</h2>
                                    <p className="checkout-item-description">Quantity: {item.quantity}</p>
                                    <p className="checkout-item-price">Price: {item.price}</p>
                                    <p className="checkout-item-subtotal">Subtotal: ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Total Price */}
                {cart.length > 0 && <p className="checkout-total">Total: ${getTotalPrice()}</p>}

                {/* Checkout Form */}
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Shipping Information</legend>
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
                    </fieldset>

                    <fieldset>
                        <legend>Payment Information</legend>
                        <div className="form-group">
                            <label htmlFor="cardName">Name on Card</label>
                            <input type="text" id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="XXXX-XXXX-XXXX-XXXX" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                            <input type="text" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input type="text" id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} required />
                        </div>
                    </fieldset>

                    <button type="submit" className="checkout-button">Place Order</button>
                    <button type="button" className="return-to-shopping" onClick={returnToShopping}>Return To Shopping</button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
