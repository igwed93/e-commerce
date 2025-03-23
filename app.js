const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: './.env' });
const userRoutes = require("./src/routes/user.routes");
const productRoutes = require("./src/routes/product.routes");
const orderRoutes = require("./src/routes/order.routes");
const cartRoutes = require("./src/routes/cart.routes");
const categoryRoutes = require("./src/routes/category.routes");
const addressRoutes = require("./src/routes/address.routes");


const app = express();

// Middlewares
app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(cartRoutes);
app.use(categoryRoutes);
app.use(addressRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));