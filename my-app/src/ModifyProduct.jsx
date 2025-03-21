import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ModifyProduct.css";

const ModifyProduct = () => {
    const navigate = useNavigate();
    const [productId, setProductId] = useState("");
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        stock: "",
    });

    useEffect(() => {
        const selectedProductId = sessionStorage.getItem("selectedProductId");

        if (!selectedProductId) {
            alert("No product selected for modification.");
            navigate("/mainpage");
            return;
        }

        setProductId(selectedProductId);

        // Fetch product details from database
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/products/${selectedProductId}`);
                const product = response.data;

                setProductData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    image: product.image,
                });
            } catch (error) {
                console.error("Failed to fetch product details:", error);
                alert("Failed to load product details.");
                navigate("/mainpage");
            }
        };

        fetchProduct();
    }, [navigate]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission (Update product)
    const handleSubmit = async (event) => {
        event.preventDefault();

        const { name, description, price, stock, image } = productData;

        if (!name || !description || !price || !image || stock === "") {
            alert("Please fill in all fields.");
            return;
        }

        if (!image.startsWith("http")) {
            alert("Please enter a valid image URL.");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/modify-product/${productId}`, {
                name,
                description,
                price,
                image,
                stock: parseInt(stock),
            });

            alert("Product updated successfully!");
            navigate("/mainpage");

        } catch (error) {
            console.error("Failed to update product:", error);
            alert("Failed to update product.");
        }
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
                            <label htmlFor="productStock">Stock Quantity</label>
                            <input
                                type="number"
                                id="productStock"
                                name="stock"
                                min="0"
                                value={productData.stock}
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
