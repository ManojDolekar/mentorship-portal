// routes/mentor.routes.js
const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/ProfileController");

router.put("/", updateProfile);

module.exports = router;
