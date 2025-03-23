const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model("Address", addressSchema);