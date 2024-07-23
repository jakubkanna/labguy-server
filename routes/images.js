const express = require("express");
const router = express.Router();
const imageInstanceController = require("../controllers/imageInstanceController");
const { jwtVerify } = require("../middleware/jwtUtils");
const multerConfig = require("../middleware/multer");

// unprotected
router.get("/", imageInstanceController.get_images);
// Protected routes for image CRUD operations
router.post("/destroy", jwtVerify, imageInstanceController.delete_images);
router.post(
  "/update/:public_id",
  jwtVerify,
  multerConfig.upload,
  multerConfig.processImage,
  imageInstanceController.update_image
);
router.post(
  "/upload",
  jwtVerify,
  multerConfig.upload,
  multerConfig.processImage,
  imageInstanceController.upload_image
);
router.post("/create", jwtVerify, imageInstanceController.create_image);

module.exports = router;
