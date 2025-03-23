const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
    try {
        // Get token from the request headers
        const token = req.header("authorization");
        // Check if token is missing
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify the token
        const cleanToken = token.replace("Bearer ", "");
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


module.exports = authorization;