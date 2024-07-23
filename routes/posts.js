const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { jwtVerify, verifyRole } = require("../middleware/jwtUtils");

// Unprotected routes
router.get("/", postController.get_posts);
router.get("/:idOrSlug", postController.get_post);

// Protected routes for post CRUD operations
router.post("/create", jwtVerify, postController.create_post);
router.post("/update/:id", jwtVerify, postController.update_post);
router.post("/delete/:id", jwtVerify, postController.delete_post);

module.exports = router;
