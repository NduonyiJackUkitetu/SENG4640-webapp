import mongoose from "mongoose";

// Function to generate unique user ID
const generateUserId = async function () {
    const lastUser = await User.findOne().sort({ userId: -1 });
    if (!lastUser) return "001";

    let lastId = parseInt(lastUser.userId, 10);
    let newId = (lastId + 1).toString().padStart(3, "0"); // Ensures format like "001", "002"
    return newId;
};

const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "owner"], default: "user" },
});

// Auto-generate user ID before saving
userSchema.pre("save", async function (next) {
    if (!this.userId) {
        this.userId = await generateUserId();
    }
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
