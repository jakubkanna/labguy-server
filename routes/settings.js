const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");
const { jwtVerify } = require("../middleware/jwtUtils");

// Protected routes
router.get("/", jwtVerify, settingController.get_settings);
router.post("/update/:id", jwtVerify, settingController.update_settings);

module.exports = router;
