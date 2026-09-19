const express = require("express");
const router = express.Router();
const sppController = require("../controllers/sppController");
const authenticate = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", sppController.getAllSpp);
router.post("/", sppController.createSpp);
router.put("/:id/toggle", sppController.toggleSppStatus);

module.exports = router;
