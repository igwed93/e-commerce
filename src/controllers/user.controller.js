const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res) => {
    const { username, email, password, phone, addresses, role } = req.body;

    // check user existense
    const userExists = await userModel.findOne({email: email});
    if (userExists) {
        return res.status(400).json({message: "User already exists!"});
    }
    try {
        const user = new userModel({ username, email, password, phone, addresses, role: role || "user" });
        await user.save();
        return res.status(201).json({ message: "User registered successfully"} );
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};


// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Please provide valid credentials"});
    }

    try {
        const user = await userModel.findOne({ email });
        // compare user password with hashed password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        return res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};


// update user
const updateUser = async (req, res) => {
    try {
        const { username, email, phone, addresses, oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        let updates = {};

        if (username) {
            updates.username = username;
        }

        if (email) {
            // Ensure email is not already in use
            const existingUser = await userModel.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: "Email already in use"});
            }
            updates.email = email;
        }

        if (phone) {
            const existingPhone = await userModel.findOne({ phone });
            if (existingPhone && existingPhone._id.toString() !== userId) {
                return res.status(400).json({ message: "Phone number already in use"});
            }
            updates.phone = phone;
        }

        if (addresses) {
            updates.addresses = addresses;
        }

        // Handle password update separately
        if (oldPassword && newPassword) {
            const user = await userModel.findById(userId);
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect old password" });
            }
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(newPassword, salt);
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true});

        return res.status(200).json({ message: "User updated successfully", user: updatedUser});
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


// delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        await userModel.findByIdAndDelete(userId);
        return res.status(200).json({ message: "User deleted successfuly!" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
};



module.exports = {registerUser, loginUser, updateUser, deleteUser};