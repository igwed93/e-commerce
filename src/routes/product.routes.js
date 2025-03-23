const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authorization");
const {
    fetchAllProducts,
    addProduct,
    fetchProductById,
    updateProductCategory
} = require("../controllers/product.controller");

router.get("/products", fetchAllProducts);
router.post("/product", authMiddleware, addProduct);
router.get("/products/:productId", fetchProductById);
router.patch("/products/:productId", authMiddleware, updateProductCategory);

module.exports = router;