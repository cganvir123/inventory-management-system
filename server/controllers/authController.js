const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper function to generate both tokens
const generateTokens = (user) => {
  // Update the payload to include email and role for the frontend
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // The beforeCreate hook in our User model will automatically hash this password
    const user = await User.create({ email, password, role });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Registration failed. Email might already exist." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // 3. Generate tokens (passing the entire user object now)
    const { accessToken, refreshToken } = generateTokens(user);

    // 4. Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // 5. Send refresh token in a secure cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Send access token to frontend memory
    res.json({
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Refresh Token Endpoint
exports.refreshToken = async (req, res) => {
  try {
    // 1. Check if the secure cookie exists
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ error: "Not authenticated" });

    // 2. Verify the refresh token hasn't expired or been tampered with
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err)
          return res
            .status(403)
            .json({ error: "Refresh token invalid or expired" });

        // 3. Ensure the token belongs to a real user in our database
        const user = await User.findByPk(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
          return res
            .status(403)
            .json({ error: "Invalid refresh token session" });
        }

        // 4. Generate a fresh Access Token (with updated payload)
        const newAccessToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "15m" },
        );

        // 5. Send it back to the client
        res.json({ accessToken: newAccessToken });
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during token refresh" });
  }
};
