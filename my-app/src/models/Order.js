import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
        {
            productId: { type: String, required: true },
            image: { type: String, required: true },
            quantity: { type: Number, required: true },
            cost: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: String, required: true }, // Store API Date as String
});

export default mongoose.model("Order", OrderSchema);
