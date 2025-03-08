import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // Ensure correct path
import Product from "./models/Product.js";
import Cart from "./models/Cart.js"; // Import Cart Model

import { ObjectId } from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Failed", err));

// Create Account Route
app.post("/create-account", async (req, res) => {
    try {
        const { fullName, address, city, state, zip, password, role } = req.body;

        if (!fullName || !address || !city || !state || !zip || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ fullName });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this name already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            address,
            city,
            state,
            zip,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error. Try again later." });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username (fullName)
        const user = await User.findOne({ fullName: username });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Compare passwords using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Send back user data without the password
        res.status(200).json({ user: { userId: user.userId, fullName: user.fullName, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error. Try again later." });
    }
});

// Route to Create Product (Only for Owner)
app.post("/create-product", async (req, res) => {
    try {
        const { name, description, price, image } = req.body;

        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if product already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this name already exists." });
        }

        const newProduct = new Product({ name, description, price, image });

        await newProduct.save();
        res.status(201).json({ message: "Product created successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error. Try again later." });
    }
});

// Route to Get All Products
app.get("/products", async (req, res) => {
    try {
        const searchQuery = req.query.search || ""; // Get search query from request

        // MongoDB query to filter products
        const products = await Product.find({
            name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch products." });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.id });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json(product);

    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Failed to fetch product." });
    }
});

// **Modify Product By `productId`**
app.put("/modify-product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { productId: id }, // Find product by `productId`
            { name, description, price, image },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product updated successfully!", updatedProduct });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product." });
    }
});

// **Delete Product By `productId`**
app.delete("/delete-product/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findOneAndDelete({ productId: id });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product deleted successfully!" });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product." });
    }
});

// Route to Get User Details by ID
app.get("/account/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Return user details (excluding password)
        res.json({
            fullName: user.fullName,
            address: user.address,
            city: user.city,
            state: user.state,
            zip: user.zip,
            role: user.role
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
});

// Route to Update User Details
app.put("/account/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, address, city, state, zip } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { userId },
            { fullName, address, city, state, zip },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "Account updated successfully!" });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
});

app.post("/cart/add", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Check if user exists
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if product exists
        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Find user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if not found
            cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
        } else {
            // Check if product is already in the cart
            const existingProduct = cart.products.find(item => item.productId === productId);
            if (existingProduct) {
                existingProduct.quantity += 1; // Increase quantity
            } else {
                cart.products.push({ productId, quantity: 1 });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Product added to cart!", cart });

    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server Error. Try again later." });
    }
});

app.get("/cart/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate("products.productId");

        if (!cart) {
            return res.status(200).json({ products: [] }); // Empty cart
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Server Error. Try again later." });
    }
});

app.put("/cart/update", async (req, res) => {
    try {
        const { userId, productId, quantityChange } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        const productIndex = cart.products.findIndex(item => item.productId === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = Math.max(1, cart.products[productIndex].quantity + quantityChange);
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated successfully!", cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: "Server Error. Try again later." });
    }
});

app.delete("/cart/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        cart.products = cart.products.filter(item => item.productId !== productId);
        await cart.save();

        res.status(200).json({ message: "Product removed from cart.", cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: "Server Error. Try again later." });
    }
});

app.post("/products/details", async (req, res) => {
    try {
        const { productIds } = req.body;
        const products = await Product.find({ productId: { $in: productIds } });
        res.json(products);
    } catch (error) {
        console.error("Failed to fetch product details:", error);
        res.status(500).json({ message: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
