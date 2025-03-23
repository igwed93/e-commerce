const mongoose = require("mongoose");

// create order schema
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: String,  // Store product name at time of purchase
            price: Number, // Store product price at time of purchase
            quantity: { type: Number, required: true},
        },
    ],
    totalAmount: { type: Number, required: true},
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);