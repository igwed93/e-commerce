const addressModel = require("../models/address.model");

// Add a new address
const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { street, city, state, zip, country, isDefault } = req.body;

        // If setting this as default, remove default from others
        if (isDefault) {
            await addressModel.updateMany({ user: userId }, { isDefault: false });
        }

        const address = new addressModel({ user: userId, street, city, state, zip, country, isDefault });
        await address.save();

        res.status(201).json({ message: "Address added successfully", address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await addressModel.find({ user: userId });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an address
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;
        const { street, city, state, zip, country, isDefault } = req.body;

        // If setting this as default, remove default from others
        if (isDefault) {
            await addressModel.updateMany({ user: userId }, { isDefault: false });
        }

        const address = await addressModel.findOneAndUpdate(
            { _id: addressId, user: userId },
            { street, city, state, zip, country, isDefault },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address updated successfully", address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user.id;

        const address = await addressModel.findOneAndDelete({ _id: addressId, user: userId });
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addAddress, getUserAddresses, updateAddress, deleteAddress };