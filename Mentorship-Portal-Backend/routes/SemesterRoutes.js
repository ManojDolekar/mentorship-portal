const express = require("express");
const router = express.Router();
const {
  uploadSemesterResult,
  updateSemesterResult,
  getMenteeResults,
  deleteSemesterResult,
} = require("../controllers/SemesterMarksController");
const { verifyToken, checkRole } = require("../controllers/AuthController");

router.post("/", uploadSemesterResult); //verifyToken
router.put("/", updateSemesterResult); //verifyToken
router.get("/", getMenteeResults); //verifyToken
router.delete("/", deleteSemesterResult); //verifyToken,
// checkRole("admin", "mentor"),

module.exports = router;
