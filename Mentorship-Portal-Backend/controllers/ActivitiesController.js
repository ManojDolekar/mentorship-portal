const con = require("../config/db.js");
const asyncHandler = require("express-async-handler");
const { APIResponse } = require("../utils/APIResponses.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create directory if it doesn't exist
const uploadDir = "uploads/activities";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for activity certificates
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use timestamp for unique temporary filename
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
}).single("activity_file");

// Create activity
const createActivity = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(400)
        .json(new APIResponse(400, false, err.message, null));
    }

    try {
      const {
        mentee_id,
        activity_description,
        associated_club,
        semester,
        completion_date,
        points,
        assigned_mentor,
      } = req.body;

      // Validate required fields
      if (!mentee_id || !activity_description || !semester) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json(
            new APIResponse(
              400,
              false,
              "Mentee ID, activity description, and semester are required",
              null
            )
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
        return res
          .status(404)
          .json(new APIResponse(404, false, "Mentee not found", null));
      }

      // Handle file if uploaded
      let filePath = null;
      if (req.file) {
        const uniNumber = mentee[0].university_number;
        const fileExt = path.extname(req.file.originalname);
        // Get the latest activity ID for this mentee and semester
        const [activities] = await con.query(
          "SELECT id FROM activities WHERE mentee_id = ? AND semester = ? ORDER BY id DESC LIMIT 1",
          [mentee_id, semester]
        );
        const activityNumber = activities.length > 0 ? activities[0].id + 1 : 1;
        const newFileName = `${uniNumber}_Sem${semester}_Activity${activityNumber}${fileExt}`;
        const newFilePath = path.join(uploadDir, newFileName);

        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      const activityData = {
        mentee_id,
        activity_description,
        associated_club: associated_club || null,
        semester,
        completion_date: completion_date || null,
        points: points || 0,
        faculty_approved: null,
        assigned_mentor: assigned_mentor || null,
        file_path: filePath,
        is_deleted: 0,
      };

      // Insert new activity
      const [result] = await con.query(
        "INSERT INTO activities SET ?",
        activityData
      );

      res.status(201).json(
        new APIResponse(201, true, "Activity created successfully", {
          id: result.insertId,
          ...activityData,
        })
      );
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Create activity error:", error);
      res
        .status(500)
        .json(new APIResponse(500, false, "Error creating activity", null));
    }
  });
});

// Update activity
const updateActivity = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(400)
        .json(new APIResponse(400, false, err.message, null));
    }

    try {
      const { id } = req.body;

      if (!id) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json(new APIResponse(400, false, "Activity ID is required", null));
      }

      // Get existing activity
      const [existingActivity] = await con.query(
        "SELECT * FROM activities WHERE id = ? AND is_deleted = 0",
        [id]
      );

      if (existingActivity.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(404)
          .json(new APIResponse(404, false, "Activity not found", null));
      }

      const {
        activity_description,
        associated_club,
        semester,
        completion_date,
        points,
        faculty_approved,
        assigned_mentor,
      } = req.body;

      // Handle file update if provided
      let filePath = existingActivity[0].file_path;
      if (req.file) {
        // Get mentee details for file naming
        const [mentee] = await con.query(
          "SELECT university_number FROM mentees WHERE id = ?",
          [existingActivity[0].mentee_id]
        );

        const uniNumber = mentee[0].university_number;
        const fileExt = path.extname(req.file.originalname);
        const newFileName = `${uniNumber}_Sem${
          semester || existingActivity[0].semester
        }_Activity${id}${fileExt}`;
        const newFilePath = path.join(uploadDir, newFileName);

        // Delete old file if exists
        if (
          existingActivity[0].file_path &&
          fs.existsSync(existingActivity[0].file_path)
        ) {
          fs.unlinkSync(existingActivity[0].file_path);
        }

        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      // Prepare update data
      const updateData = {
        activity_description:
          activity_description || existingActivity[0].activity_description,
        associated_club:
          associated_club !== undefined
            ? associated_club
            : existingActivity[0].associated_club,
        semester: semester || existingActivity[0].semester,
        completion_date: completion_date || existingActivity[0].completion_date,
        points: points !== undefined ? points : existingActivity[0].points,
        faculty_approved:
          faculty_approved !== undefined
            ? faculty_approved
            : existingActivity[0].faculty_approved,
        assigned_mentor:
          assigned_mentor !== undefined
            ? assigned_mentor
            : existingActivity[0].assigned_mentor,
        file_path: filePath,
      };

      // Update the record
      await con.query("UPDATE activities SET ? WHERE id = ?", [updateData, id]);

      // Get updated record
      const [updatedActivity] = await con.query(
        `SELECT a.*, m.university_number, m.full_name as mentee_name
                 FROM activities a
                 JOIN mentees m ON m.id = a.mentee_id
                 WHERE a.id = ?`,
        [id]
      );

      res.json(
        new APIResponse(
          200,
          true,
          "Activity updated successfully",
          updatedActivity[0]
        )
      );
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Update activity error:", error);
      res
        .status(500)
        .json(new APIResponse(500, false, "Error updating activity", null));
    }
  });
});

// Get mentee activities
const getMenteeActivities = asyncHandler(async (req, res) => {
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

    // Get all activities for the mentee
    const [activities] = await con.query(
      `SELECT 
                a.*,
                m.university_number,
                m.full_name as mentee_name,
                m.email as mentee_email
            FROM activities a
            JOIN mentees m ON m.id = a.mentee_id
            WHERE a.mentee_id = ? 
            AND a.is_deleted = 0
            ORDER BY a.semester ASC, a.id ASC`,
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
      activities: activities,
    };

    res.json(
      new APIResponse(200, true, "Activities retrieved successfully", response)
    );
  } catch (error) {
    console.error("Error fetching activities:", error);
    res
      .status(500)
      .json(new APIResponse(500, false, "Error retrieving activities", null));
  }
});

// Delete activity
const deleteActivity = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Activity ID is required", null));
  }

  try {
    const [result] = await con.query(
      "UPDATE activities SET is_deleted = 1 WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(new APIResponse(404, false, "Activity not found", null));
    }

    res.json(new APIResponse(200, true, "Activity deleted successfully", null));
  } catch (error) {
    console.error("Delete activity error:", error);
    res
      .status(500)
      .json(new APIResponse(500, false, "Error deleting activity", null));
  }
});

// Faculty approval for activity
//Without faculty_approved parameter
// const facultyApproval = asyncHandler(async (req, res) => {
//   try {
//     const { activity_id, mentor_id } = req.query;

//     // Validate required fields
//     if (!activity_id || !mentor_id) {
//       return res
//         .status(400)
//         .json(
//           new APIResponse(
//             400,
//             false,
//             "Activity ID and Mentor ID are required",
//             null
//           )
//         );
//     }

//     // Get the activity and check if it exists
//     const [activity] = await con.query(
//       "SELECT * FROM activities WHERE id = ? AND is_deleted = 0",
//       [activity_id]
//     );

//     if (activity.length === 0) {
//       return res
//         .status(404)
//         .json(new APIResponse(404, false, "Activity not found", null));
//     }

//     // Check if the mentor ID matches the assigned mentor
//     if (activity[0].assigned_mentor !== parseInt(mentor_id)) {
//       return res
//         .status(403)
//         .json(
//           new APIResponse(
//             403,
//             false,
//             "Unauthorized: Only the assigned mentor can approve this activity",
//             null
//           )
//         );
//     }

//     // Check if activity is already approved
//     if (activity[0].faculty_approved) {
//       return res
//         .status(400)
//         .json(
//           new APIResponse(400, false, "Activity is already approved", null)
//         );
//     }

//     // Update the activity with faculty approval
//     await con.query("UPDATE activities SET faculty_approved = 1 WHERE id = ?", [
//       activity_id,
//     ]);

//     // Get updated activity details
//     const [updatedActivity] = await con.query(
//       `SELECT a.*,
//                   m.university_number,
//                   m.full_name as mentee_name,
//                   mentor.full_name as mentor_name
//            FROM activities a
//            JOIN mentees m ON m.id = a.mentee_id
//            LEFT JOIN mentors mentor ON mentor.id = a.assigned_mentor
//            WHERE a.id = ?`,
//       [activity_id]
//     );

//     res.json(
//       new APIResponse(
//         200,
//         true,
//         "Activity approved successfully",
//         updatedActivity[0]
//       )
//     );
//   } catch (error) {
//     console.error("Faculty approval error:", error);
//     res
//       .status(500)
//       .json(
//         new APIResponse(500, false, "Error processing faculty approval", null)
//       );
//   }
// });

// With faculty_approved parameter
const facultyApproval = asyncHandler(async (req, res) => {
  try {
    const { activity_id, mentor_id, faculty_approved } = req.body;

    // Validate required fields
    if (!activity_id || !mentor_id || faculty_approved === undefined) {
      return res
        .status(400)
        .json(
          new APIResponse(
            400,
            false,
            "Activity ID, Mentor ID and approval status are required",
            null
          )
        );
    }

    // Get the activity and check if it exists
    const [activity] = await con.query(
      "SELECT * FROM activities WHERE id = ? AND is_deleted = 0",
      [activity_id]
    );

    if (activity.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(404, false, "Activity not found", null));
    }

    // Check if the mentor ID matches the assigned mentor
    if (activity[0].assigned_mentor !== parseInt(mentor_id)) {
      return res
        .status(403)
        .json(
          new APIResponse(
            403,
            false,
            "Unauthorized: Only the assigned mentor can update this activity's status",
            null
          )
        );
    }

    // Check if the current status is the same as requested
    if (activity[0].faculty_approved === parseInt(faculty_approved)) {
      const message =
        faculty_approved === 1
          ? "Activity is already approved"
          : "Activity is already rejected";
      return res.status(400).json(new APIResponse(400, false, message, null));
    }

    // Update the activity with faculty approval status
    await con.query("UPDATE activities SET faculty_approved = ? WHERE id = ?", [
      faculty_approved,
      activity_id,
    ]);

    // Get updated activity details
    const [updatedActivity] = await con.query(
      `SELECT a.*, 
              m.university_number,
              m.full_name as mentee_name,
              mentor.full_name as mentor_name
       FROM activities a
       JOIN mentees m ON m.id = a.mentee_id
       LEFT JOIN mentors mentor ON mentor.id = a.assigned_mentor
       WHERE a.id = ?`,
      [activity_id]
    );

    const message =
      parseInt(faculty_approved) === 1
        ? "Activity approved successfully"
        : "Activity rejected successfully";

    res.json(new APIResponse(200, true, message, updatedActivity[0]));
  } catch (error) {
    console.error("Faculty approval error:", error);
    res
      .status(500)
      .json(
        new APIResponse(
          500,
          false,
          "Error processing faculty approval status",
          null
        )
      );
  }
});

// Get mentees for mentor with their activities
const getMentorMentees = asyncHandler(async (req, res) => {
  const { mentor_id } = req.query;

  if (!mentor_id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Mentor ID is required", null));
  }

  try {
    // First verify if mentor exists
    const [mentor] = await con.query(
      `SELECT id, full_name, email_address 
           FROM mentors 
           WHERE id = ? AND is_deleted = 0`,
      [mentor_id]
    );

    if (mentor.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(404, false, "Mentor not found", null));
    }

    // // Get all unique mentees who have activities assigned to this mentor
    // const [mentees] = await con.query(
    //   `SELECT DISTINCT 
    //           m.id,
    //           m.university_number,
    //           m.full_name,
    //           m.email,
    //           m.role
    //       FROM mentees m
    //       INNER JOIN activities a ON m.id = a.mentee_id
    //       WHERE a.assigned_mentor = ?
    //       AND m.is_deleted = 0
    //       AND a.is_deleted = 0`,
    //   [mentor_id]
    // );

    const [mentees] = await con.query(
      `SELECT 
          m.id,
          m.university_number,
          m.full_name,
          m.email,
          m.role
       FROM mentees m
       WHERE m.mentor_id = ?
         AND m.is_deleted = 0`,
      [mentor_id]
    );
    


    // For each mentee, get their activities
    const menteesWithActivities = await Promise.all(
      mentees.map(async (mentee) => {
        const [activities] = await con.query(
          `SELECT 
                  id,
                  activity_description,
                  associated_club,
                  semester,
                  completion_date,
                  points,
                  faculty_approved,
                  file_path,
                  created_at,
                  updated_at
              FROM activities 
              WHERE mentee_id = ? 
              AND assigned_mentor = ? 
              AND is_deleted = 0
              ORDER BY semester ASC, created_at DESC`,
          [mentee.id, mentor_id]
        );

        return {
          mentee_details: {
            id: mentee.id,
            university_number: mentee.university_number,
            full_name: mentee.full_name,
            email: mentee.email,
            role:mentee.role
          },
          activities: activities.map((activity) => ({
            ...activity,
            completion_date: activity.completion_date
              ? new Date(activity.completion_date).toISOString().split("T")[0]
              : null,
          })),
        };
      })
    );

    // Prepare response with mentor details and mentees data
    const response = {
      mentor_details: {
        id: mentor[0].id,
        full_name: mentor[0].full_name,
        email_address: mentor[0].email_address,
      },
      mentees: menteesWithActivities,
    };

    res.json(
      new APIResponse(
        200,
        true,
        "Mentor's mentees retrieved successfully",
        response
      )
    );
  } catch (error) {
    console.error("Error fetching mentor's mentees:", error);
    res
      .status(500)
      .json(
        new APIResponse(500, false, "Error retrieving mentor's mentees", null)
      );
  }
});

// Get total points for a mentee
//Without faculty_approval
// const getMenteeTotalPoints = asyncHandler(async (req, res) => {
//   const { mentee_id } = req.query;

//   if (!mentee_id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Mentee ID is required", null));
//   }

//   try {
//     // Check if mentee exists
//     const [mentee] = await con.query(
//       "SELECT id FROM mentees WHERE id = ? AND is_deleted = 0",
//       [mentee_id]
//     );

//     if (mentee.length === 0) {
//       return res
//         .status(404)
//         .json(new APIResponse(404, false, "Mentee not found", null));
//     }

//     // Get sum of points
//     const [pointsResult] = await con.query(
//       "SELECT COALESCE(SUM(points), 0) as total_points FROM activities WHERE mentee_id = ? AND is_deleted = 0",
//       [mentee_id]
//     );

//     res.json(
//       new APIResponse(200, true, "Total points retrieved successfully", {
//         total_points: pointsResult[0].total_points,
//       })
//     );
//   } catch (error) {
//     console.error("Error fetching total points:", error);
//     res
//       .status(500)
//       .json(new APIResponse(500, false, "Error retrieving total points", null));
//   }
// });

//With faculty_approval
const getMenteeTotalPoints = asyncHandler(async (req, res) => {
  const { mentee_id } = req.query;

  if (!mentee_id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Mentee ID is required", null));
  }

  try {
    // Check if mentee exists
    const [mentee] = await con.query(
      "SELECT id FROM mentees WHERE id = ? AND is_deleted = 0",
      [mentee_id]
    );

    if (mentee.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(404, false, "Mentee not found", null));
    }

    // Get sum of points where faculty_approved = 1
    const [pointsResult] = await con.query(
      "SELECT COALESCE(SUM(points), 0) as total_points FROM activities WHERE mentee_id = ? AND faculty_approved = 1 AND is_deleted = 0",
      [mentee_id]
    );

    res.json(
      new APIResponse(200, true, "Total points retrieved successfully", {
        total_points: pointsResult[0].total_points,
      })
    );
  } catch (error) {
    console.error("Error fetching total points:", error);
    res
      .status(500)
      .json(new APIResponse(500, false, "Error retrieving total points", null));
  }
});

module.exports = {
  createActivity,
  updateActivity,
  getMenteeActivities,
  deleteActivity,
  facultyApproval,
  getMentorMentees,
  getMenteeTotalPoints,
};
