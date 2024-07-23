const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/ProjectController");
const { jwtVerify } = require("../middleware/jwtUtils");

// Unprotected routes
router.get("/", ProjectController.get_Projects);
router.get("/:id", ProjectController.get_Project);
router.get("/:id/images", ProjectController.get_images);

// Protected routes for Project CRUD operations
router.post("/create", jwtVerify, ProjectController.create_Project);
router.post("/update/:id", jwtVerify, ProjectController.update_Project);
router.post("/delete/:id", jwtVerify, ProjectController.delete_Project);
module.exports = router;
