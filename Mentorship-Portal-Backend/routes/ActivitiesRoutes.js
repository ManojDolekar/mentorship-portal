const express = require("express");
const router = express.Router();
const {
  createActivity,
  updateActivity,
  getMenteeActivities,
  deleteActivity,
  facultyApproval,
  getMentorMentees,
  getMenteeTotalPoints,
} = require("../controllers/ActivitiesController");
// const { verifyToken, checkRole } = require("../controllers/AuthController");

router.post("/", createActivity);
router.put("/", updateActivity);
router.get("/", getMenteeActivities);
router.delete("/", deleteActivity);
router.put("/faculty-approval", facultyApproval);
router.get("/mentor-mentees", getMentorMentees);
router.get("/mentee-points", getMenteeTotalPoints);
// checkRole("admin", "mentor"),

module.exports = router;
