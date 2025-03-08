import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // Ensure correct path

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
