import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // Ensure correct path

dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Failed", err));

// Default products
const defaultProducts = [
    { name: "GPU AMD", description: "High-performance GPU", price: 499.99, image: "https://i.imgur.com/O7IjlrC.jpeg" },
    { name: "GPU Nvidia", description: "Powerful gaming GPU", price: 599.99, image: "https://i.imgur.com/GlaVtyl.jpeg" },
    { name: "Gaming Mouse", description: "Ergonomic gaming mouse", price: 39.99, image: "https://i.imgur.com/cYfD4aM.jpeg" },
    { name: "Motherboard", description: "High-end motherboard", price: 199.99, image: "https://i.imgur.com/qNninPn.jpeg" },
];

// Function to seed database
const seedProducts = async () => {
    try {
        // Check if products already exist
        const existingProducts = await Product.find();
        if (existingProducts.length > 0) {
            console.log("Default products already exist. Skipping...");
            mongoose.connection.close();
            return;
        }

        // Insert default products
        await Product.insertMany(defaultProducts);
        console.log("Default products added successfully!");

        // Close DB connection
        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding products:", error);
        mongoose.connection.close();
    }
};

// Run the function
seedProducts();
