import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // Ensure correct path
import Product from "./models/Product.js";

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
        res.status(200).json({ user: { fullName: user.fullName, role: user.role } });

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
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch products." });
    }
});

// Route to Modify Product
app.put("/modify-product/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { productId: id },
            { name, description, price, image },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product updated successfully!", updatedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update product." });
    }
});

// Route to Delete Product
app.delete("/delete-product/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findOneAndDelete({ productId: id });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.json({ message: "Product deleted successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete product." });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
