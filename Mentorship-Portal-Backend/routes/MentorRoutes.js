// routes/mentor.routes.js
const express = require("express");
const router = express.Router();
const {
  getMentors,
  addMentor,
  updateMentor,
  deleteMentor,
} = require("../controllers/MentorController");

router.get("/", getMentors);
router.post("/", addMentor);
router.put("/", updateMentor);
router.delete("/", deleteMentor);

module.exports = router;
