import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainPage.css";

const MainPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        // Load active user
        const activeUser = JSON.parse(sessionStorage.getItem("activeUser"));
        setUser(activeUser);

        fetchProducts();
    }, []);

    // Handle logout
    const handleLogout = () => {
        sessionStorage.removeItem("activeUser");
        navigate("/");
    };

    // Handle adding a new product
    const handleAddProduct = () => {
        navigate("/createProduct");
    };

    // Handle modifying a product
    const handleModifyProduct = async (productId) => {
        if (user?.role !== "owner") {
            alert("You are not authorized to modify products.");
            return;
        }

        sessionStorage.setItem("selectedProductId", productId);
        navigate("/modifyProduct");
    };

    // Handle deleting a product
    const handleDeleteProduct = async (productId) => {
        if (user?.role !== "owner") {
            alert("You are not authorized to delete products.");
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/delete-product/${productId}`);
            setProducts(products.filter((product) => product.productId !== productId));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    // Add to Cart Functionality
    const handleAddToCart = (index) => {
        const product = products[index];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find((item) => item.name === product.name);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    };

    // Buy Now Functionality
    const handleBuyNow = (index) => {
        const product = products[index];
        const cart = [{ ...product, quantity: 1 }];
        localStorage.setItem("cart", JSON.stringify(cart));
        navigate("/checkout");
    };
    return (
        <div className="mainpage">
            <header className="header">
                <h1>Welcome to Our Store</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="hamburger-menu">
                <button id="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
                {menuOpen && (
                    <div className="menu-content">
                        <button onClick={() => navigate("/cart")}>Cart</button>
                        {user?.role === "owner" && <button onClick={handleAddProduct}>Add Product</button>}
                        <button onClick={() => navigate("/account")}>My Account</button>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                )}
            </div>

            <div className="container">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="product" key={product.productId}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <div className="product-info">
                                <p>{product.description}</p>
                                <div className="price">${product.price.toFixed(2)}</div>
                                <button className="buy-now" onClick={() => handleBuyNow(index)}>Buy Now</button>
                                <button className="add-to-cart" onClick={() => handleAddToCart(index)}>Add to Cart</button>
                                {user?.role === "owner" && (
                                    <>
                                        <button onClick={() => handleModifyProduct(product.productId)}>Modify</button>
                                        <button onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default MainPage;
