import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // Ensure correct path
import Product from "./models/Product.js";
import Cart from "./models/Cart.js"; // Import Cart Model
import Order from "./models/Order.js";
import axios from "axios"; // Import axios for API calls

const ObjectId = mongoose.Types.ObjectId;

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
        const { name, description, price, image, stock } = req.body;

        // Check for missing fields
        if (!name || !description || !price || !image || stock === undefined) {
            return res.status(400).json({ message: "All fields are required, including stock." });
        }

        // Check if product already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product with this name already exists." });
        }

        // Create the new product with stock
        const newProduct = new Product({
            name,
            description,
            price,
            image,
            stock,
        });

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
        const searchQuery = req.query.search || "";
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);

        const filter = {
            name: { $regex: searchQuery, $options: "i" },
        };

        if (!isNaN(minPrice)) {
            filter.price = { ...filter.price, $gte: minPrice };
        }

        if (!isNaN(maxPrice)) {
            filter.price = { ...filter.price, $lte: maxPrice };
        }

        const products = await Product.find(filter);
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
        const { name, description, price, image, stock } = req.body;

        const updatedProduct = await Product.findOneAndUpdate(
            { productId: id }, // Find product by `productId`
            { name, description, price, image, stock },
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

// Checkout route
app.post("/checkout", async (req, res) => {
    try {
        const { userId } = req.body;

        // Fetch the cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Fetch product details using productId
        const productIds = cart.products.map(item => item.productId);
        const productDetails = await Product.find({ productId: { $in: productIds } });

        // Map products for quick lookup
        const productMap = {};
        productDetails.forEach(product => {
            productMap[product.productId] = product;
        });

        const orderProducts = [];

        // Iterate through each cart item
        for (const item of cart.products) {
            const product = productMap[item.productId];

            if (!product) {
                console.error("Missing product details:", item);
                throw new Error(`Product details missing for productId: ${item.productId}`);
            }

            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
                });
            }

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();

            // Add to order array
            orderProducts.push({
                productId: product.productId,
                image: product.image,
                quantity: item.quantity,
                cost: parseFloat(product.price) * item.quantity,
            });
        }

        // Calculate total amount
        const totalAmount = orderProducts.reduce((sum, item) => sum + item.cost, 0);
        if (isNaN(totalAmount)) {
            throw new Error("Total amount calculation failed.");
        }

        // Get current time (from API or fallback)
        let orderDate;
        try {
            const timeResponse = await axios.get("https://worldtimeapi.org/api/timezone/Etc/UTC");
            orderDate = timeResponse.data.datetime;
        } catch (error) {
            console.warn("Time API failed, using local system time.");
            orderDate = new Date().toISOString();
        }

        // Save the order
        const newOrder = new Order({
            userId,
            products: orderProducts,
            totalAmount,
            orderDate,
        });

        await newOrder.save();

        // Clear cart
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });

    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Server error during checkout.", error: error.message });
    }
});


app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude password field for security
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error fetching users." });
    }
});

app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().lean(); // Get all orders

        // Fetch product details for each order
        for (let order of orders) {
            for (let product of order.products) {
                const productDetails = await Product.findOne({ productId: product.productId }).lean();
                if (productDetails) {
                    product.name = productDetails.name; // Add product name
                    product.image = productDetails.image; // Ensure correct image
                }
            }
        }

        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

app.get("/orders/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all orders for the user
        const orders = await Order.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        // Fetch product details for each order
        const populatedOrders = await Promise.all(
            orders.map(async (order) => {
                const enrichedProducts = await Promise.all(
                    order.products.map(async (item) => {
                        const product = await Product.findOne({ productId: item.productId });
                        return {
                            productId: item.productId,
                            name: product ? product.name : "Unknown Product",
                            image: product ? product.image : "",
                            quantity: item.quantity,
                            cost: item.cost,
                        };
                    })
                );
                return { ...order._doc, products: enrichedProducts };
            })
        );

        res.status(200).json(populatedOrders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Failed to fetch orders." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
