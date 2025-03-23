# E-Commerce API

This is a RESTful e-commerce API built with Express.js and MongoDB, allowing users to manage products, categories, carts, orders, and addresses. Authentication is handled via JWT tokens.

## Features
- User authentication (registration & login)
- Product & category management
- Cart & order management
- Address handling for checkout
- Role-based access (admin & user)

---

## 🛠️ Installation

### **1. Clone the repository**
```bash
git clone https://github.com/your-repo/ecommerce-api.git
cd ecommerce-api
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Set up environment variables**
Create a `.env` file in the root directory and add:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### **4. Start the server**
```bash
npm start
```
OR (for automatic reload on changes)
```bash
npx nodemon server.js
```

---

## 🚀 API Endpoints

### **1️⃣ Authentication**
| Method | Endpoint        | Description           | Access |
|--------|----------------|-----------------------|--------|
| POST   | /register  | Register a new user  | Public |
| POST   | /login     | Login & get a token  | Public |

---

### **2️⃣ Categories**
| Method | Endpoint                | Description                     | Access     |
|--------|--------------------------|---------------------------------|------------|
| POST   | /category            | Create a new category          | Admin      |
| GET    | /categories          | Get all categories             | Public     |
| GET    | /categories/:id      | Get all products in a category | Public     |

---

### **3️⃣ Products**
| Method | Endpoint              | Description                        | Access     |
|--------|----------------------|------------------------------------|------------|
| POST   | /product         | Add a new product                 | Admin      |
| GET    | /products        | Get all products                  | Public     |
| GET    | /products/:id    | Get a single product (with category) | Public |
| PATCH  | /products/:id    | Update product category           | Admin      |

---

### **4️⃣ Cart**
| Method | Endpoint             | Description                          | Access |
|--------|---------------------|--------------------------------------|--------|
| POST   | /cart           | Add a product to cart               | User   |
| GET    | /cart           | Get user’s cart                     | User   |
| PATCH  | /cart/:id       | Update product quantity in cart     | User   |
| DELETE | /cart/:id       | Remove product from cart            | User   |

---

### **5️⃣ Orders**
| Method | Endpoint                  | Description                     | Access |
|--------|--------------------------|---------------------------------|--------|
| POST   | /order               | Place an order from cart       | User   |
| GET    | /order/user          | Get user’s orders              | User   |
| GET    | /order               | Get all orders (admin only)    | Admin  |
| PUT    | /order/:id/status    | Update order status            | Admin  |
| PUT    | /order/:id/cancel    | Cancel an order (if pending)   | User   |

---

### **6️⃣ Address Management**
| Method | Endpoint              | Description                 | Access |
|--------|----------------------|-----------------------------|--------|
| POST   | /address         | Add a new address           | User   |
| GET    | /address         | Get all user addresses      | User   |
| PATCH  | /address/:id     | Update an address          | User   |
| DELETE | /address/:id     | Delete an address          | User   |

---

## 🔐 Authentication & Authorization
- Users must include a **JWT token** in requests requiring authentication.
- Example **Authorization Header**:
```json
{
    "Authorization": "Bearer your_token"
}
```
- Admin users have additional privileges such as adding products, categories, and managing orders.

---

## 📌 Notes
- Orders **must be placed from the cart** (users cannot manually enter product IDs).
- Users must **provide an address ID** when placing an order.
- Stock is updated after an order is placed.

---

## 💡 Future Enhancements
- Implement payment integration.
- Add order tracking system.
- Implement product reviews & ratings.

---

## 🤝 Contributing
Feel free to fork and submit a pull request!

---

## 📝 License
This project is open-source under the **MIT License**.
