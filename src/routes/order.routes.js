const express = require("express");
const router  = express.Router();
const authMiddleware = require("../middleware/authorization");
const {
    placeOrder,
    getAllOrders,
    getUserOrders,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/order.controller");

router.post("/order", authMiddleware, placeOrder);
router.get("/order", authMiddleware, getAllOrders);
router.get("/order/user", authMiddleware, getUserOrders);
router.put("/order/:orderId/cancel", authMiddleware, cancelOrder);
router.put("/order/:id/status", authMiddleware, updateOrderStatus);




module.exports = router;