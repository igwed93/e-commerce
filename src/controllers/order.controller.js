const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");
const addressModel = require("../models/address.model");
// Place an order
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.body;

        // Validate the address
        const address = await addressModel.findOne({ _id: addressId, user: userId });
        if (!address) {
            return res.status(400).json({ message: "Invalid address. Please select a valid address." });
        }

        // Find the user's cart
        const cart = await cartModel.findOne({ user: userId }).populate("products.product", "name price stock");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Your cart is empty. Add products before placing an order."});
        }

        let totalAmount = 0;
        const orderItems = [];

        // Process each product in the cart
        for (const cartItem of cart.products) {
            const product = cartItem.product;
            if (product.stock < cartItem.quantity) {
                console.log(`This is product's stock ${product.stock}`);
                console.log(`This is cartItem's quantity ${cartItem.quantity}`);
                return res.status(400).json({ message: `Not enough stock for product: ${product.name}`});
            }

            totalAmount += product.price * cartItem.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity
            });

            // Reduce stock for each product
            await productModel.findByIdAndUpdate(product._id, { $inc: { stock: -cartItem.quantity } });
        }

        // Create the order
        const order = new orderModel({
            user: userId,
            products: orderItems,
            totalAmount,
            address: addressId
        });
        await order.save();

        // Clear the user's cart after order is placed
        await cartModel.findByIdAndUpdate(userId, { products: [] });

        return res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Get All Orders (Admin Only)
const getAllOrders = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const orders = await orderModel.find()
        .populate("user", "username email")
        .populate("products.product", "name price")
        .sort({ createdAt: -1 }) // Sort by newest orders first
        .lean();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get User's Orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderModel.find({ user: userId }).populate("products.product", "name price")
        .populate("address", "street city state zip country").lean();

        if (orders.length === 0) {
            return res.status(400).json({ message: "This user has no order" });
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { status } = req.body;
        if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status "});
        }

        const order = await orderModel.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("products.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Cancel Order (User Only)
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await orderModel.findOne({ _id: orderId, user: req.user.id });

        // Check if order exists
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Only pending orders can be cancelled" });
        }

        order.status = "cancelled";
        await order.save();

        return res.status(200).json({ message: "Order cancelled successfuly", order });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}



module.exports = { placeOrder, getAllOrders, getUserOrders, updateOrderStatus, cancelOrder };