const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authorization");
const { createCategory, getAllCategories, getProductsByCategory } = require("../controllers/category.controller");

router.post("/category", authMiddleware, createCategory); // Admin only
router.get("/categories", getAllCategories); // Public
router.get("/categories/:categoryId/products", getProductsByCategory); // Get products under a category

module.exports = router;
