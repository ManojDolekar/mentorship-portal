const express = require("express");
const router = express.Router();
const {
  getMentees,
  addMentee,
  updateMentee,
  deleteMentee,
} = require("../controllers/MenteeController");

router.get("/", getMentees);
router.post("/", addMentee);
router.put("/", updateMentee);
router.delete("/", deleteMentee);

module.exports = router;
