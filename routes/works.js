const express = require("express");
const router = express.Router();
const workController = require("../controllers/workController");
const { jwtVerify } = require("../middleware/jwtUtils");

// Unprotected routes
router.get("/", workController.get_works);
router.get("/medium-list", workController.get_medium_list);
router.get("/:id/images", workController.get_images);

// Protected routes for work CRUD operations
router.post("/create", jwtVerify, workController.create_work);
router.post("/update/:id", jwtVerify, workController.update_work);
router.post("/delete/:id", jwtVerify, workController.delete_work);

module.exports = router;
