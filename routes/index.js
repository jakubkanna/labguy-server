var express = require("express");
var router = express.Router();

var userController = require("../controllers/userController");
var userController = require("../controllers/userController");

// Unprotected routes
router.post("/login", userController.post_login);

module.exports = router;
