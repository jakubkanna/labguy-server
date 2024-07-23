const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");

// Unprotected routes
router.get("/", mediaController.get_all_media);

module.exports = router;
