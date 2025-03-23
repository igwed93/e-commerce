const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");

// Get all products
const fetchAllProducts = async (req, res) => {
    try {
        const products = await productModel.find().populate("category", "name");
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Add a product (Admin only)
const addProduct = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    
    const { name, description, price, category, stock } = req.body;
    try {
        const product = new productModel({ name, description, price, category, stock });
        await product.save();
        return res.status(201).json(product);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

// Fetch a product
const fetchProductById = async (req, res) => {
    const id = req.params.productId;
    try {
        const product = await productModel.findById(id).populate("category", "name description");
        if (!product) {
            res.status(404).json({ message: "Product not found"});
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Update product category
const updateProductCategory = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { categoryId } = req.body;
        const productId = req.params.productId;

        // Check if category exists
        const categoryExists = await categoryModel.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if product exists
        const productExists = await productModel.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update product's category
        productExists.category = categoryId;
        await productExists.save();

        // Update product's category
        const updatedProduct = await productModel.findById(productId).populate("category", "name description");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {fetchAllProducts, addProduct, fetchProductById, updateProductCategory };