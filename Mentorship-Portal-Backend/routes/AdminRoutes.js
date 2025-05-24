const express = require("express");
const router = express.Router();
const {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/AdminController");

router.get("/", getAdmins);
router.post("/", addAdmin);
router.put("/", updateAdmin);
router.delete("/", deleteAdmin);

module.exports = router;
