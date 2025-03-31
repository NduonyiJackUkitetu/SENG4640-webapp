import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainPage.css";
import User from "./models/User";

const MainPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [cartHasItems, setCartHasItems] = useState(false);



    // Fetch products from the server (including search functionality)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/products", {
                    params: {
                        search: searchQuery,
                        minPrice,
                        maxPrice,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        const fetchCart = async (userId) => {
            try {
                const res = await axios.get(`http://localhost:5000/cart/${userId}`);
                setCartHasItems(res.data?.products?.length > 0);
            } catch (err) {
                console.error("Failed to fetch cart:", err);
            }
        };

        const activeUser = JSON.parse(sessionStorage.getItem("activeUser"));
        setUser(activeUser);
        fetchProducts();

        if (activeUser) {
            fetchCart(activeUser.userId);
        }

    }, [searchQuery, minPrice, maxPrice]); // fixed dependencies


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

    // Handle Add to Cart (API Call)
    const handleAddToCart = async (product) => {
        if (!user) {
            alert("You must be logged in to add to cart.");
            navigate("/");
            return;
        }

        if (product.stock <= 0) {
            alert("Product is out of stock.");
            return;
        }

        try {
            await axios.post("http://localhost:5000/cart/add", {
                userId: user.userId,
                productId: product.productId,
            });

            alert(`${product.name} added to cart!`);
            setCartHasItems(true);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Could not add product to cart. Try again later.");
        }
    };

    // Buy Now Functionality
    const handleBuyNow = async (product) => {
        if (!user) {
            alert("You must be logged in to make a purchase.");
            navigate("/");
            return;
        }

        if (product.stock <= 0) {
            alert("Product is out of stock.");
            return;
        }

        try {
            // Add product to cart in the database
            await axios.post("http://localhost:5000/cart/add", {
                userId: user.userId,
                productId: product.productId,
            });

            // Redirect to checkout page
            navigate("/checkout");
        } catch (error) {
            console.error("Error during Buy Now:", error);
            alert("Could not process purchase. Please try again.");
        }
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
                <div className="cart-icon-wrapper" onClick={() => navigate("/cart")}>
                    <img
                        src={
                            cartHasItems
                                ? "https://i.imgur.com/CEIbiHH.png"
                                : "https://i.imgur.com/g2dkkSW.png"
                        }
                        alt="Cart"
                        className="cart-icon"
                    />
                    {cartHasItems && <span className="cart-notification-dot"></span>}

                </div>

            </header>

            <div className="hamburger-menu">
                <button id="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
                {menuOpen && (
                    <div className="menu-content">
                        <button onClick={() => navigate("/cart")}>Cart</button>
                        <button onClick={() => navigate("/userOrders")}>My Orders</button>
                        {user?.role === "owner" && <button onClick={handleAddProduct}>Add Product</button>}
                        {user?.role === "owner" && <button onClick={() => navigate("/managementPage")}>Management</button>}
                        <button onClick={() => navigate("/account")}>My Account</button>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                )}
            </div>



            <div className="filter-bar">
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>


            <div className="container">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="product" key={product.productId}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <div className="product-info">
                                <p>{product.description}</p>
                                <p className="stock-info">
                                    Stock: {product.stock > 0 ? product.stock : <span style={{ color: "red" }}>Out of Stock</span>}
                                </p>

                                <div className="price">${parseFloat(product.price).toFixed(2)}</div>
                                <button className="buy-now" onClick={() => handleBuyNow(product)} disabled={product.stock <= 0}>Buy Now</button>
                                <button className="add-to-cart" onClick={() => handleAddToCart(product)} disabled={product.stock <= 0}>Add to Cart</button>
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
