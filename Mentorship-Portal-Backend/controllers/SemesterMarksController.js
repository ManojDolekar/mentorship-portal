const con = require("../config/db.js");
const asyncHandler = require("express-async-handler");
const { APIResponse } = require("../utils/APIResponses.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create directory if it doesn't exist
const uploadDir = "uploads/results";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// First store file with temporary name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use timestamp to create unique temporary filename
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `temp_${timestamp}${ext}`);
  },
});

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("result_file");

const validateSemester = (semester) => {
    const semesterNum = parseInt(semester);
    if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        return {
            isValid: false,
            message: "Semester must be a number between 1 and 8"
        };
    }
    return { isValid: true };
};

// UploadSemesterResult function
const uploadSemesterResult = asyncHandler(async (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            return res.status(400).json(
                new APIResponse(400, false, err.message, null)
            );
        }

        try {
            const {
                mentee_id,
                semester,
                cgpa,
                sgpa,
                backlogs,
                clearing_date,
                results,
            } = req.body;


            // Validate required fields
            if (!mentee_id || !semester) {
                // Clean up temporary file if it exists
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json(
                    new APIResponse(400, false, "Mentee ID and semester are required", null)
                );
            }

            // Validate semester range
            const semesterValidation = validateSemester(semester);
            if (!semesterValidation.isValid) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json(
                    new APIResponse(400, false, semesterValidation.message, null)
                );
            }

            // Check if mentee exists
            const [mentee] = await con.query(
                "SELECT university_number FROM mentees WHERE id = ? AND is_deleted = 0",
                [mentee_id]
            );

            if (mentee.length === 0) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json(
                    new APIResponse(404, false, "Mentee not found", null)
                );
            }

            // Check if result already exists for this semester
            const [existingResult] = await con.query(
                "SELECT id, file_path FROM semester_results WHERE mentee_id = ? AND semester = ? AND is_deleted = 0",
                [mentee_id, semester]
            );

            if (existingResult.length > 0) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json(
                    new APIResponse(
                        400, 
                        false, 
                        `Results for semester ${semester} already exist for this mentee. Use update API to modify existing results.`,
                        null
                    )
                );
            }

            // Validate CGPA and SGPA if provided
            if (cgpa && (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10)) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json(
                    new APIResponse(400, false, "CGPA must be between 0 and 10", null)
                );
            }

            if (sgpa && (parseFloat(sgpa) < 0 || parseFloat(sgpa) > 10)) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json(
                    new APIResponse(400, false, "SGPA must be between 0 and 10", null)
                );
            }

            // If file was uploaded, rename it properly
            let filePath = null;
            if (req.file) {
                const uniNumber = mentee[0].university_number;
                const fileExt = path.extname(req.file.originalname);
                const newFileName = `${uniNumber}_Sem_${semester}_Result${fileExt}`;
                const newFilePath = path.join(uploadDir, newFileName);

                // Delete existing file if it exists
                if (fs.existsSync(newFilePath)) {
                    fs.unlinkSync(newFilePath);
                }

                // Rename temp file to final name
                fs.renameSync(req.file.path, newFilePath);
                filePath = newFilePath;
            }

            const resultData = {
                mentee_id,
                semester,
                cgpa: cgpa || null,
                sgpa: sgpa || null,
                backlogs: backlogs || 0,
                clearing_date: clearing_date || null,
                results: results || null,
                file_path: filePath
            };

            // Insert new result
            const [result] = await con.query(
                "INSERT INTO semester_results SET ?",
                resultData
            );

            res.status(201).json(
                new APIResponse(201, true, "Semester result uploaded successfully", {
                    id: result.insertId,
                    ...resultData
                })
            );

        } catch (error) {
            // Clean up temporary file if it exists and there was an error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            console.error("Upload error:", error);
            res.status(500).json(
                new APIResponse(500, false, "Error uploading semester result", null)
            );
        }
    });
});

// Update semester result
const updateSemesterResult = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(400)
        .json(new APIResponse(400, false, err.message, null));
    }

    try {
      const { id } = req.body; // Get result ID from query params

      if (!id) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json(new APIResponse(400, false, "Result ID is required", null));
      }

      const { semester, cgpa, sgpa, backlogs, clearing_date, results } =
        req.body;

      // Get existing result first
      const [existingResult] = await con.query(
        "SELECT * FROM semester_results WHERE id = ? AND is_deleted = 0",
        [id]
      );

      if (existingResult.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(404)
          .json(new APIResponse(404, false, "Semester result not found", null));
      }

      // If semester is being updated, validate it
      if (semester) {
        // Validate semester range
        const semesterValidation = validateSemester(semester);
        if (!semesterValidation.isValid) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res
            .status(400)
            .json(
              new APIResponse(400, false, semesterValidation.message, null)
            );
        }

        // Check if the new semester number already exists for this mentee
        if (parseInt(semester) !== parseInt(existingResult[0].semester)) {
          const [duplicateSemester] = await con.query(
            "SELECT id FROM semester_results WHERE mentee_id = ? AND semester = ? AND id != ? AND is_deleted = 0",
            [existingResult[0].mentee_id, semester, id]
          );

          if (duplicateSemester.length > 0) {
            if (req.file) {
              fs.unlinkSync(req.file.path);
            }
            return res
              .status(400)
              .json(
                new APIResponse(
                  400,
                  false,
                  `Results for semester ${semester} already exist for this mentee`,
                  null
                )
              );
          }
        }
      }

      // Validate CGPA if provided
      if (cgpa !== undefined) {
        const cgpaValue = parseFloat(cgpa);
        if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res
            .status(400)
            .json(
              new APIResponse(400, false, "CGPA must be between 0 and 10", null)
            );
        }
      }

      // Validate SGPA if provided
      if (sgpa !== undefined) {
        const sgpaValue = parseFloat(sgpa);
        if (isNaN(sgpaValue) || sgpaValue < 0 || sgpaValue > 10) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res
            .status(400)
            .json(
              new APIResponse(400, false, "SGPA must be between 0 and 10", null)
            );
        }
      }

      // Validate backlogs if provided
      if (backlogs !== undefined) {
        const backlogsValue = parseInt(backlogs);
        if (isNaN(backlogsValue) || backlogsValue < 0) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res
            .status(400)
            .json(
              new APIResponse(
                400,
                false,
                "Backlogs must be a non-negative number",
                null
              )
            );
        }
      }

      // Validate clearing_date if provided
      if (clearing_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(clearing_date)) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res
            .status(400)
            .json(
              new APIResponse(
                400,
                false,
                "Clearing date must be in YYYY-MM-DD format",
                null
              )
            );
        }
      }

      // Handle file upload if provided
      let filePath = existingResult[0].file_path;
      if (req.file) {
        // Get mentee details for file naming
        const [mentee] = await con.query(
          "SELECT university_number FROM mentees WHERE id = ?",
          [existingResult[0].mentee_id]
        );

        const uniNumber = mentee[0].university_number;
        const fileExt = path.extname(req.file.originalname);
        const newFileName = `${uniNumber}_Sem_${
          semester || existingResult[0].semester
        }_Result${fileExt}`;
        const newFilePath = path.join(uploadDir, newFileName);

        // Delete old file if it exists
        if (
          existingResult[0].file_path &&
          fs.existsSync(existingResult[0].file_path)
        ) {
          fs.unlinkSync(existingResult[0].file_path);
        }

        // Rename new file
        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      // Prepare update data
      const updateData = {
        semester: semester || existingResult[0].semester,
        cgpa: cgpa !== undefined ? cgpa : existingResult[0].cgpa,
        sgpa: sgpa !== undefined ? sgpa : existingResult[0].sgpa,
        backlogs:
          backlogs !== undefined ? backlogs : existingResult[0].backlogs,
        clearing_date: clearing_date || existingResult[0].clearing_date,
        results: results || existingResult[0].results,
        file_path: filePath,
      };

      // Update the record
      await con.query("UPDATE semester_results SET ? WHERE id = ?", [
        updateData,
        id,
      ]);

      // Get updated record
      const [updatedResult] = await con.query(
        `SELECT sr.*, m.university_number, m.full_name as mentee_name
                FROM semester_results sr
                JOIN mentees m ON m.id = sr.mentee_id
                WHERE sr.id = ?`,
        [id]
      );

      res.json(
        new APIResponse(
          200,
          true,
          "Semester result updated successfully",
          updatedResult[0]
        )
      );
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Update error:", error);
      res
        .status(500)
        .json(
          new APIResponse(500, false, "Error updating semester result", null)
        );
    }
  });
});

// Get semester results for a mentee
const getMenteeResults = asyncHandler(async (req, res) => {
  const { mentee_id } = req.query;

  if (!mentee_id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Mentee ID is required", null));
  }

  try {
    // First get mentee details
    const [mentee] = await con.query(
      `SELECT id, university_number, full_name, email 
            FROM mentees 
            WHERE id = ? AND is_deleted = 0`,
      [mentee_id]
    );

    if (mentee.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(404, false, "Mentee not found", null));
    }

    // Get all semester results for the mentee
    const [results] = await con.query(
      `SELECT 
                sr.*,
                m.university_number,
                m.full_name as mentee_name,
                m.email as mentee_email
                FROM semester_results sr
                JOIN mentees m ON m.id = sr.mentee_id
                WHERE sr.mentee_id = ? 
                AND sr.is_deleted = 0 
                ORDER BY sr.semester ASC`,
      [mentee_id]
    );

    // Format the response
    const response = {
      mentee_details: {
        id: mentee[0].id,
        university_number: mentee[0].university_number,
        full_name: mentee[0].full_name,
        email: mentee[0].email,
      },
      semester_results: results.map((result) => ({
        id: result.id,
        semester: result.semester,
        cgpa: result.cgpa,
        sgpa: result.sgpa,
        backlogs: result.backlogs,
        clearing_date: result.clearing_date,
        results: result.results,
        file_path: result.file_path,
        created_at: result.created_at,
        updated_at: result.updated_at,
      })),
    };

    res.json(
      new APIResponse(200, true, "Results retrieved successfully", response)
    );
  } catch (error) {
    console.error("Error fetching results:", error);
    res
      .status(500)
      .json(new APIResponse(500, false, "Error retrieving results", null));
  }
});

// Delete semester result
const deleteSemesterResult = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Result ID is required", null));
  }

  const [result] = await con.query(
    "UPDATE semester_results SET is_deleted = 1 WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json(new APIResponse(404, false, "Result not found", null));
  }

  res.json(new APIResponse(200, true, "Result deleted successfully", null));
});

module.exports = {
  uploadSemesterResult,
  updateSemesterResult,
  getMenteeResults,
  deleteSemesterResult,
};
