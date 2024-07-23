const express = require("express");
const router = express.Router();
const { jwtVerify } = require("../middleware/jwtUtils");
const videoInstanceController = require("../controllers/videoInstanceController");

// Route to get all videos (unprotected)
router.get("/", videoInstanceController.get_videos);

// Protected routes for video CRUD operations
router.post("/create", jwtVerify, videoInstanceController.create_video);
router.post("/update/:id", jwtVerify, videoInstanceController.update_video);
router.post("/delete", jwtVerify, videoInstanceController.delete_videos);

module.exports = router;
