const express = require("express");
const router = express.Router();
const {
  createEntry,
  getEntries,
  getPendingApprovals,
  updateApprovalStatus,
} = require("../controllers/inwardController");
const verifyToken = require("../middleware/authMiddleware");

// The verifyToken middleware runs FIRST. If it fails, the request never reaches createEntry/getEntries.
router.post("/", verifyToken, createEntry);
router.get("/", verifyToken, getEntries);

// New HOD Approval routes secured with the same middleware
router.get("/pending", verifyToken, getPendingApprovals);
router.put("/:id/status", verifyToken, updateApprovalStatus);

module.exports = router;
