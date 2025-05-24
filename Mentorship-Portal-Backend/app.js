const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Paths
const AuthRoutes = require("./routes/AuthRoutes.js");
const MenteeRoutes = require("./routes/MenteeRoutes.js");
const MentorRoutes = require("./routes/MentorRoutes.js");
const SemesterRoutes = require("./routes/SemesterRoutes.js");
const ActivitiesRoutes = require("./routes/ActivitiesRoutes.js");
const AdminRoutes = require("./routes/AdminRoutes.js");
const ProfileRoute = require("./routes/ProfileRoute.js");

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Mentorship Portal API" });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/mentee", MenteeRoutes);
app.use("/api/mentor", MentorRoutes);
app.use("/api/semester-results", SemesterRoutes);
app.use("/api/activities", ActivitiesRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/profile", ProfileRoute);

app.use("/uploads", express.static("uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something broke!",
    error: err.message,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
