import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ModifyProduct.css";

const ModifyProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });

    useEffect(() => {
        const selectedProductIndex = parseInt(localStorage.getItem("selectedProductIndex"), 10);
        if (isNaN(selectedProductIndex)) {
            alert("No product selected for modification.");
            navigate("/mainpage");
            return;
        }

        const defaultProducts = [
            { name: "GPU AMD", description: "High-performance GPU", price: "$499.99", image: "https://i.imgur.com/O7IjlrC.jpeg" },
            { name: "GPU Nvidia", description: "Powerful gaming GPU", price: "$599.99", image: "https://i.imgur.com/GlaVtyl.jpeg" },
            { name: "Gaming Mouse", description: "Ergonomic gaming mouse", price: "$39.99", image: "https://i.imgur.com/cYfD4aM.jpeg" },
            { name: "Motherboard", description: "High-end motherboard", price: "$199.99", image: "https://i.imgur.com/qNninPn.jpeg" },
        ];

        let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        let allProducts = [...defaultProducts, ...storedProducts];

        if (selectedProductIndex < 0 || selectedProductIndex >= allProducts.length) {
            alert("Invalid product selected.");
            navigate("/mainpage");
            return;
        }

        let selectedProduct = allProducts[selectedProductIndex];

        setProductData({
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price.replace("$", ""),
            image: selectedProduct.image,
        });
    }, [navigate]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        const { name, description, price, image } = productData;
        const selectedProductIndex = parseInt(localStorage.getItem("selectedProductIndex"), 10);

        if (!name || !description || !price || !image) {
            alert("Please fill in all fields.");
            return;
        }

        if (!image.startsWith("http")) {
            alert("Please enter a valid image URL.");
            return;
        }

        const defaultProductsCount = 4;
        let storedProducts = JSON.parse(localStorage.getItem("products")) || [];

        if (selectedProductIndex >= defaultProductsCount) {
            storedProducts[selectedProductIndex - defaultProductsCount] = {
                name,
                description,
                price: `$${parseFloat(price).toFixed(2)}`,
                image,
            };

            localStorage.setItem("products", JSON.stringify(storedProducts));
        } else {
            alert("You cannot modify default products!");
            return;
        }

        alert("Product updated successfully!");
        navigate("/mainpage");
    };

    return (
        <div className="modifyproduct-page">
            <div className="modifyproduct-container">
                <h1>Modify Product Listing</h1>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Product Details</legend>

                        <div className="modifyproduct-form-group">
                            <label htmlFor="productName">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                name="name"
                                value={productData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="modifyproduct-form-group">
                            <label htmlFor="productDescription">Description</label>
                            <textarea
                                id="productDescription"
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="modifyproduct-form-group">
                            <label htmlFor="productPrice">Price ($)</label>
                            <input
                                type="number"
                                id="productPrice"
                                name="price"
                                min="0"
                                step="0.01"
                                value={productData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="modifyproduct-form-group">
                            <label htmlFor="productImage">Image URL</label>
                            <input
                                type="text"
                                id="productImage"
                                name="image"
                                placeholder="Paste image URL"
                                value={productData.image}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </fieldset>

                    <button type="submit" className="modifyproduct-update-btn">Update Product</button>
                    <button type="button" className="modifyproduct-back-btn" onClick={() => navigate("/mainpage")}>
                        Back to Shop
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModifyProduct;
