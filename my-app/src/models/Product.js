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
        let nextId = 1;
        let exists = true;

        while (exists) {
            const candidateId = String(nextId).padStart(3, "0");
            exists = await mongoose.model("Product").exists({ productId: candidateId });
            if (!exists) {
                this.productId = candidateId;
            } else {
                nextId++;
            }
        }
    }
    next();
});


export default mongoose.model("Product", productSchema);
