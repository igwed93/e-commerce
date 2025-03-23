const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authorization");
const {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
} = require("../controllers/cart.controller");

router.post("/cart", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getCart);
router.delete("/cart/:productId", authMiddleware, removeFromCart);
router.patch("/cart/:productId", authMiddleware, updateCartQuantity);

module.exports = router;