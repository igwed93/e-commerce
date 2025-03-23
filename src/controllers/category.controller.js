const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");

// Create a new category (Admin only)
const createCategory = async (req, res) => {
    if (req.user.role !== "admin") {
        res.status(403).json({ message: "Access denied. Admins only." });
    }

    try {
        const category = new categoryModel(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};


// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get all products under a specific category
const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await productModel.find({ category: categoryId });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { createCategory, getAllCategories, getProductsByCategory };