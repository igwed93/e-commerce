const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// create user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true, unique: true},
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    role: { type: String, enum: ["user", "admin"], default: "user"},
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("User", userSchema);