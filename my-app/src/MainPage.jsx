import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Load active user
        const activeUser = JSON.parse(localStorage.getItem("activeUser"));
        setUser(activeUser);

        // Load default and stored products
        const defaultProducts = [
            { name: "GPU AMD", description: "High-performance GPU", price: "$499.99", image: "https://i.imgur.com/O7IjlrC.jpeg" },
            { name: "GPU Nvidia", description: "Powerful gaming GPU", price: "$599.99", image: "https://i.imgur.com/GlaVtyl.jpeg" },
            { name: "Gaming Mouse", description: "Ergonomic gaming mouse", price: "$39.99", image: "https://i.imgur.com/cYfD4aM.jpeg" },
            { name: "Motherboard", description: "High-end motherboard", price: "$199.99", image: "https://i.imgur.com/qNninPn.jpeg" },
        ];
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts([...defaultProducts, ...storedProducts]);
    }, []);

    // Handle product search
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("activeUser");
        navigate("/");
    };

    // Handle adding new product (only for owners)
    const handleAddProduct = () => {
        navigate("/createProduct");
    };

    // Handle cart navigation
    const goToCart = () => {
        navigate("/cart");
    };

    // Handle account navigation
    const goToAccount = () => {
        navigate("/account");
    };

    // Handle delete product (only for owners)
    const handleDeleteProduct = (index) => {
        if (user?.role !== "owner") return alert("You are not authorized to delete products.");

        let updatedProducts = [...products];
        if (index >= 4) { // Only allow deleting stored products
            updatedProducts.splice(index, 1);
            localStorage.setItem("products", JSON.stringify(updatedProducts.slice(4))); // Exclude default products
            setProducts(updatedProducts);
        } else {
            alert("Default products cannot be deleted.");
        }
    };

    // Modify product
    const handleModifyProduct = (index) => {
        if (user?.role !== "owner") {
            alert("You are not authorized to modify products.");
            return;
        }

        localStorage.setItem("selectedProductIndex", index);
        localStorage.setItem("allProducts", JSON.stringify(products));
        navigate("/modifyProduct");
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
            {/* Header Section */}
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

            {/* Hamburger Menu */}
            <div className="hamburger-menu">
                <button id="menuToggle" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
                {menuOpen && (
                    <div className="menu-content">
                        <button onClick={goToCart}>Cart</button>
                        {user?.role === "owner" && <button onClick={handleAddProduct}>Add Product</button>}
                        <button onClick={goToAccount}>My Account</button>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                )}
            </div>

            {/* Product List */}
            <div className="container">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div className="product" key={index}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <div className="product-info">
                                <p>{product.description}</p>
                                <div className="price">{product.price}</div>
                                <div className="button-container">
                                    <button className="buy-now" onClick={() => handleBuyNow(index)}>Buy Now</button>
                                    <button className="add-to-cart" onClick={() => handleAddToCart(index)}>Add to Cart</button>
                                    {user?.role === "owner" && (
                                        <>
                                            <button className="delete-product" onClick={() => handleDeleteProduct(index)}>Delete</button>
                                            <button className="modify-product" onClick={() => handleModifyProduct(index)}>Modify</button>
                                        </>
                                    )}
                                </div>
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
