const express = require("express");
const router = express.Router();
const {
  login,
//   verifyToken,
//   checkRole,
} = require("../controllers/AuthController");

// Login route
router.post("/login", login);

module.exports = router;
