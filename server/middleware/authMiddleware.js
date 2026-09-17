const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Check if the Authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // 2. Extract the token (Format: "Bearer <token>")
  const token = authHeader.split(" ")[1];

  try {
    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 4. Attach the decoded user ID to the request object so subsequent functions can use it
    req.user = decoded;
    next(); // Move on to the actual API controller
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired access token." });
  }
};

module.exports = verifyToken;
