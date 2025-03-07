import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProduct.css";

const CreateProduct = () => {
    const navigate = useNavigate();
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
    });

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Validate and submit the form
    const handleSubmit = (event) => {
        event.preventDefault();

        const { name, description, price, image } = productData;

        if (!name || !description || !price || !image) {
            alert("Please fill in all fields.");
            return;
        }

        // Validate Image URL
        if (!image.startsWith("http")) {
            alert("Please enter a valid image URL.");
            return;
        }

        // Retrieve existing products from localStorage
        let products = JSON.parse(localStorage.getItem("products")) || [];

        // Create new product object
        let newProduct = {
            name,
            description,
            price: `$${parseFloat(price).toFixed(2)}`,
            image,
        };

        // Add new product to array and update localStorage
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        alert("Product added successfully!");
        navigate("/mainpage"); // Redirect to main page
    };

    return (
        <div className="createproduct-page">
            <div className="createproduct-container">
                <h1>Create a New Product</h1>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Product Details</legend>

                        <div className="createproduct-form-group">
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

                        <div className="createproduct-form-group">
                            <label htmlFor="productDescription">Description</label>
                            <textarea
                                id="productDescription"
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="createproduct-form-group">
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

                        <div className="createproduct-form-group">
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

                    <button type="submit" className="createproduct-add-btn">Add Product</button>
                    <button type="button" className="createproduct-back-btn" onClick={() => navigate("/mainpage")}>Back to Shop</button>
                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
