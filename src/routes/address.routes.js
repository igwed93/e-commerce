const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authorization");
const { addAddress, getUserAddresses, updateAddress, deleteAddress } = require("../controllers/address.controller");

router.post("/address", authMiddleware, addAddress); // Add an address
router.get("/address", authMiddleware, getUserAddresses); // Get all user addresses
router.patch("/address/:addressId", authMiddleware, updateAddress); // Update an address
router.delete("/address/:addressId", authMiddleware, deleteAddress); // Delete an address

module.exports = router;