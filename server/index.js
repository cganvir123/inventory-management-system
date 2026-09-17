const express = require("express");
const sequelize = require("./config/db");
const User = require("./models/User");
const InwardRegister = require("./models/InwardRegister");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const inwardRoutes = require("./routes/inwardRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Allows us to read the httpOnly cookie
app.use(
  cors({
    origin: "http://localhost:5173", // We will set up React on port 5173 later
    credentials: true, // Crucial for sending cookies between front/back end
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inward", inwardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
