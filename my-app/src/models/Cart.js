import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // Ensure one cart per user
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

export default mongoose.model("Cart", CartSchema);
