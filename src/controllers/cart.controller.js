const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");


// Add Item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;  // Get user ID from JWT
        const { productId, quantity } = req.body;

        // check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(400).json({ message: "Product not found" });
        }

        // Find user's cart
        let cart = await cartModel.findOne({ user: userId});

        if (!cart) {
            // Create a new cart if not found
            cart = new cartModel({ user: userId, products: [] });
        }

        // check if product is already in cart
        const existingProductIndex = cart.products.findIndex(item => item.product.toString() == productId);

        if (existingProductIndex > -1) {
            // Update quantity if product already exists
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return res.status(200).json({ message: "Item added to cart", cart});
    } catch (err) {
        return res.status(500).json({ message: "Product not found" });
    }
}


// Get User's Cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartModel.findOne({ user: userId })
        .populate("products.product", "name price").lean();; // Populate the product details

        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        return res.status(200).json(cart);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Remove Item from Cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        // Find user's cart
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Remove product from cart
        cart.products = cart.products.filter(item => item.product.toString() !== productId);

        await cart.save();
        return res.status(200).json({ message: "item removed from cart", cart });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// product quantity in cart
const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        // Find the user's cart
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the product inside the cart
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        // Update the quantity
        cart.products[productIndex].quantity = quantity;
        await cart.save();

        return res.status(200).json({ message: "Cart updated successfully", cart });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


module.exports = { addToCart, getCart, removeFromCart, updateCartQuantity };