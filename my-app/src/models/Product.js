import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: { type: String, unique: true }, // Unique product ID (001, 002, etc.)
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 }
});

// Auto-generate unique productId
productSchema.pre("save", async function (next) {
    if (!this.productId) {
        const count = await mongoose.model("Product").countDocuments();
        this.productId = String(count + 1).padStart(3, "0"); // Generate sequential ID
    }
    next();
});

export default mongoose.model("Product", productSchema);
