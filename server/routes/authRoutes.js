const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refreshToken); // New route to get a new access token
// Add this to your authRoutes.js
router.post("/logout", (req, res) => {
  // Clear the httpOnly cookie holding the token
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
