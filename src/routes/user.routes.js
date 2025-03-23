const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    deleteUser,
    updateUser
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authorization");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/user/:id", authMiddleware, deleteUser);
router.put("/user/:id", authMiddleware, updateUser);




module.exports = router;