import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState({});
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("activeUser"));

    useEffect(() => {
        if (!user) {
            alert("You must be logged in to checkout.");
            navigate("/");
            return;
        }

        const fetchCart = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/cart/${user.userId}`);
                if (response.data && response.data.products) {
                    setCart(response.data.products);
                    fetchProductDetails(response.data.products);
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        const fetchProductDetails = async (cartItems) => {
            try {
                const productIds = cartItems.map(item => item.productId);
                const response = await axios.post(`http://localhost:5000/products/details`, { productIds });
                if (response.data) {
                    // Convert product array to an object { productId: productDetails }
                    const productMap = response.data.reduce((acc, product) => {
                        acc[product.productId] = product;
                        return acc;
                    }, {});
                    setProducts(productMap);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/account/${user.userId}`);
                if (response.data) {
                    setFormData((prevData) => ({
                        ...prevData,
                        fullName: response.data.fullName || "",
                        address: response.data.address || "",
                        city: response.data.city || "",
                        state: response.data.state || "",
                        zip: response.data.zip || "",
                    }));
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchCart();
        fetchUserDetails();
    }, []);

    // Calculate total price
    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const product = products[item.productId]; // Get product details
            if (product) {
                return total + parseFloat(product.price) * item.quantity;
            }
            return total;
        }, 0).toFixed(2);
    };

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle checkout submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send checkout request to the backend
            const response = await axios.post("http://localhost:5000/checkout", { userId: user.userId });

            alert(`Order placed successfully! Your order time: ${response.data.order.orderDate}`);
            navigate("/mainpage");
        } catch (error) {
            console.error("Error during checkout:", error);
            if (error.response?.data?.message) {
                alert(`Checkout failed: ${error.response.data.message}`);
            } else {
                alert("Failed to place order. Please try again.");
            }
        }
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
                        cart.map((item, index) => {
                            const product = products[item.productId]; // Retrieve product details
                            return product ? (
                                <div key={index} className="checkout-item">
                                    <img src={product.image} alt={product.name} className="checkout-item-image" />
                                    <div className="checkout-item-details">
                                        <h2 className="checkout-item-title">{product.name}</h2>
                                        <p className="checkout-item-description">Quantity: {item.quantity}</p>
                                        <p className="checkout-item-price">Price: ${parseFloat(product.price).toFixed(2)}</p>
                                        <p className="checkout-item-subtotal">
                                            Subtotal: ${(parseFloat(product.price) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div key={index} className="checkout-item">
                                    <p className="error-text">Product details missing for one item.</p>
                                </div>
                            );
                        })
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
                    <button type="button" className="return-to-shopping" onClick={() => navigate("/mainpage")}>Return To Shopping</button>
                    <button style={{ border: "none", background: "transparent", padding: 0 }}>
                        <img
                            src="https://i.imgur.com/ZCIqckE.png"
                            alt="Buy with PayPal"
                            style={{
                                cursor: "pointer",
                                height: "auto",
                                display: "block",
                                justifySelf: "center",
                                width: "200px",
                                height: "50px",
                                borderRadius: "6px"
                            }}
                        />
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Checkout;
