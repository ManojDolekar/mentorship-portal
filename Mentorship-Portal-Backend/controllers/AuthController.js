const con = require("../config/db.js");
const asyncHandler = require("express-async-handler");
const { APIResponse } = require("../utils/APIResponses.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Mentor1233";

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(
        new APIResponse(400, false, "Email and password are required", null)
      );
  }

  try {
    // Check in mentees table
    const [menteeResult] = await con.query(
      "SELECT id, email, password, full_name, contact_number, university_number, address, file_path, role, mentor_id FROM mentees WHERE email = ? AND is_deleted = 0",
      [email]
    );

    // Check in mentors table
    const [mentorResult] = await con.query(
      "SELECT id, email_address as email, password, contact_number, full_name, file_path, role FROM mentors WHERE email_address = ? AND is_deleted = 0",
      [email]
    );

    // Check in admins table
    const [adminResult] = await con.query(
      "SELECT id, email, password, username as full_name, role FROM admins WHERE email = ? AND is_deleted = 0",
      [email]
    );

    // Combine results
    const user = menteeResult[0] || mentorResult[0] || adminResult[0];

    if (!user) {
      return res
        .status(401)
        .json(new APIResponse(401, false, "Invalid email or password", null));
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json(new APIResponse(401, false, "Invalid email or password", null));
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        contact_number: user.contact_number,
        mentor_id: user.mentor_id,
        universtity_number: user.universtity_number,
        address: user.address,
        file_path: user.file_path,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove password from user object
    delete user.password;

    res.json(
      new APIResponse(200, true, "Login successful", {
        user,
        token,
      })
    );
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json(
        new APIResponse(500, false, "An error occurred during login", null)
      );
  }
});

// Middleware to verify JWT token
const verifyToken = asyncHandler(async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return res
      .status(401)
      .json(new APIResponse(401, false, "No token provided", null));
  }

  try {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    const decoded = jwt.verify(bearerToken, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new APIResponse(401, false, "Invalid token", null));
  }
});

// Middleware for role-based access control
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(new APIResponse(401, false, "Unauthorized", null));
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(new APIResponse(403, false, "Access forbidden", null));
    }

    next();
  };
};

module.exports = {
  login,
  verifyToken,
  checkRole,
};
