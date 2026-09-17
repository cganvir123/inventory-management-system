const express = require("express");
const router = express.Router();
const { createEntry, getEntries } = require("../controllers/inwardController");
const verifyToken = require("../middleware/authMiddleware");

// The verifyToken middleware runs FIRST. If it fails, the request never reaches createEntry/getEntries.
router.post("/", verifyToken, createEntry);
router.get("/", verifyToken, getEntries);

module.exports = router;
