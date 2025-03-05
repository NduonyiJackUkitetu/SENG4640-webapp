import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

// Sample product data (Replace with API call if needed)
const productData = [
    { id: 1, name: "GPU AMD", price: "$19.99", notes:"Short description here.", image: "https://i.imgur.com/O7IjlrC.jpeg" },
    { id: 2, name: "GPU Nvidia", price: "$19.99", notes:"Short description here.", image: "https://i.imgur.com/GlaVtyl.jpeg" },
    { id: 3, name: "Mouse", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/cYfD4aM.jpeg" },
    { id: 4, name: "Motherboard", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/qNninPn.jpeg" },
    { id: 5, name: "GPU AMD", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/O7IjlrC.jpeg" },
    { id: 6, name: "Mouse", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/cYfD4aM.jpeg" },
    { id: 7, name: "Motherboard", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/qNninPn.jpeg" },
    { id: 8, name: "GPU Nvidia", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/GlaVtyl.jpeg" },
    { id: 9, name: "Mouse", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/cYfD4aM.jpeg" },
    { id: 10, name: "Keyboard", price: "$39.99", notes:"Short description here.", image: "https://i.imgur.com/JK4Yyxh.jpeg" },
];

const MainPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Filter products based on search
    const filteredProducts = productData.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add to cart function
    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find((item) => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
    };

    // Buy now function (Redirect to checkout)
    const buyNow = (product) => {
        const cart = [{ ...product, quantity: 1 }];
        localStorage.setItem("cart", JSON.stringify(cart));
        navigate("/checkout");
    };

    // View cart function
    const viewCart = () => {
        navigate("/cart");
    };

    return (
        <div className="main-page">
            <div className="header">Welcome to Our Store</div>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={viewCart}>Cart</button>
            </div>

            {/* Product List */}
            <div className="container">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <div className="product-info">
                                <p>{product.notes}</p>
                                <div className="price">{product.price}</div>
                                <div className="button-container">
                                    <button className="buy-now" onClick={() => buyNow(product)}>
                                        Buy Now
                                    </button>
                                    <button className="add-to-cart" onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No products found.</p>
                )}
            </div>
        </div>
    );
};

export default MainPage;
