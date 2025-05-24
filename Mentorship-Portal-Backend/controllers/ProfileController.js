const con = require("../config/db.js");
const asyncHandler = require("express-async-handler");
const { APIResponse } = require("../utils/APIResponses.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create directories if they don't exist
const menteeUploadDir = "uploads/profile/mentees";
const mentorUploadDir = "uploads/profile/mentors";

[menteeUploadDir, mentorUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const role = req.body.role?.toLowerCase();
    const uploadPath = role === "mentee" ? menteeUploadDir : mentorUploadDir;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Use timestamp for temporary file
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `temp_${timestamp}${ext}`);
  },
});

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("profilePicture");

// Update profile endpoint
const updateProfile = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(400)
        .json(new APIResponse(400, false, err.message, null));
    }

    try {
      const {
        id,
        role,
        full_name,
        contact_number,
        email,
        university_number,
        address,
      } = req.body;

      // Validate required fields
      if (!id || !role) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json(new APIResponse(400, false, "ID and role are required", null));
      }

      const roleLower = role.toLowerCase();
      if (!["mentee", "mentor"].includes(roleLower)) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json(new APIResponse(400, false, "Invalid role specified", null));
      }

      // Get existing user data
      const tableName = roleLower === "mentee" ? "mentees" : "mentors";
      const [existingUser] = await con.query(
        `SELECT * FROM ${tableName} WHERE id = ? AND is_deleted = 0`,
        [id]
      );

      if (existingUser.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(404)
          .json(new APIResponse(404, false, `${roleLower} not found`, null));
      }

      // Handle file upload if provided
      let filePath = existingUser[0].file_path;
      if (req.file) {
        let newFileName;
        if (roleLower === "mentee") {
          const userUniNumber =
            university_number || existingUser[0].university_number;
          const ext = path.extname(req.file.originalname);
          newFileName = `${userUniNumber}_profile${ext}`;
        } else {
          const userName = (full_name || existingUser[0].full_name).replace(
            /\s+/g,
            "_"
          );
          const ext = path.extname(req.file.originalname);
          newFileName = `${userName}_${id}_profile${ext}`;
        }

        const uploadPath =
          roleLower === "mentee" ? menteeUploadDir : mentorUploadDir;
        const newFilePath = path.join(uploadPath, newFileName);

        // Delete old file if exists
        if (
          existingUser[0].file_path &&
          fs.existsSync(existingUser[0].file_path)
        ) {
          fs.unlinkSync(existingUser[0].file_path);
        }

        // Rename new file
        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      // Prepare update data based on role
      const updateData = {};
      if (filePath) updateData.file_path = filePath;
      if (full_name) updateData.full_name = full_name;
      if (contact_number) updateData.contact_number = contact_number;

      if (roleLower === "mentee") {
        if (email) updateData.email = email;
        if (university_number) updateData.university_number = university_number;
        if (address) updateData.address = address;
      } else {
        if (email) updateData.email_address = email; // Different column name for mentors
      }

      // Update the record
      await con.query(`UPDATE ${tableName} SET ? WHERE id = ?`, [
        updateData,
        id,
      ]);

      // Get updated record
      const [updatedUser] = await con.query(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [id]
      );

      res.json(
        new APIResponse(
          200,
          true,
          "Profile updated successfully",
          updatedUser[0]
        )
      );
    } catch (error) {
      // Clean up uploaded file if it exists and there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Profile update error:", error);
      res
        .status(500)
        .json(new APIResponse(500, false, "Error updating profile", null));
    }
  });
});

module.exports = {
  updateProfile,
};
