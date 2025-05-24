// const con = require("../config/db.js");
// const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt");
// const { APIResponse } = require("../utils/APIResponses.js");

// // GET - Retrieve mentees with pagination and search
// const getMentees = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
//   const offset = (page - 1) * rowsPerPage; 
//   const searchColumn = req.query.filter || "full_name";
//   const searchWord = req.query.query;
//   const id = req.query.id;
//   const mentor_id = req.query.mentor_id;

//   let query = "SELECT * FROM mentees WHERE is_deleted = 0";
//   let countQuery = "SELECT COUNT(*) as total FROM mentees WHERE is_deleted = 0";
//   const queryParams = [];

//   if (searchWord) {
//     const searchCondition = ` AND ${searchColumn} LIKE ?`;
//     query += searchCondition;
//     countQuery += searchCondition;
//     queryParams.push(`%${searchWord}%`);
//   }

//   if (id) {
//     const idCondition = " AND id = ?";
//     query += idCondition;
//     countQuery += idCondition;
//     queryParams.push(id);
//   }

//   if (mentor_id) {
//     const mentorCondition = " AND mentor_id = ?";
//     query += mentorCondition;
//     countQuery += mentorCondition;
//     queryParams.push(mentor_id);
//   }

//   query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
//   const paginationParams = [rowsPerPage, offset];

//   const [menteesResult, countResult] = await Promise.all([
//     con.query(query, [...queryParams, ...paginationParams]),
//     con.query(countQuery, queryParams),
//   ]);

//   const [totalRows] = countResult[0];
//   const totalMentees = totalRows.total || 0;
//   const totalPages = Math.ceil(totalMentees / rowsPerPage);

//   res.json(
//     new APIResponse(200, true, "Mentees retrieved successfully", {
//       mentees: menteesResult[0],
//       pagination: {
//         page,
//         rowsPerPage,
//         totalMentees,
//         totalPages,
//       },
//     })
//   );
// });

// // POST - Add a new mentee
// const addMentee = asyncHandler(async (req, res) => {
//   const {
//     university_number,
//     username,
//     full_name,
//     contact_number,
//     email,
//     password,
//     address,
//     mentor_id,
//   } = req.body;

//   if (
//     !university_number ||
//     !username ||
//     !full_name ||
//     !contact_number ||
//     !email ||
//     !password ||
//     !address ||
//     !mentor_id
//   ) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "All fields are required", null));
//   }

//   // Validate password strength
//   if (password.length < 6) {
//     return res
//       .status(400)
//       .json(
//         new APIResponse(
//           400,
//           false,
//           "Password must be at least 6 characters long",
//           null
//         )
//       );
//   }

//   const existingMentee = await con.query(
//     "SELECT * FROM mentees WHERE university_number = ? OR username = ? OR email = ? AND is_deleted = 0",
//     [university_number, username, email]
//   );

//   if (existingMentee[0].length > 0) {
//     return res
//       .status(400)
//       .json(
//         new APIResponse(
//           400,
//           false,
//           "Duplicate entry found for university number, username, or email",
//           null
//         )
//       );
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newMentee = {
//     university_number,
//     username,
//     full_name,
//     contact_number,
//     email,
//     password: hashedPassword, // Store hashed password
//     address,
//     mentor_id,
//     is_deleted: 0,
//   };

//   const [result] = await con.query("INSERT INTO mentees SET ?", newMentee);

//   // Remove password from response
//   const responseData = { ...newMentee };
//   delete responseData.password;

//   res.status(201).json(
//     new APIResponse(201, true, "Mentee added successfully", {
//       id: result.insertId,
//       ...responseData,
//     })
//   );
// });

// // PUT - Update a mentee
// const updateMentee = asyncHandler(async (req, res) => {
//   const {
//     id,
//     university_number,
//     username,
//     full_name,
//     contact_number,
//     email,
//     password,
//     address,
//     mentor_id,
//   } = req.body;

//   if (!id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Mentee ID is required", null));
//   }

//   const [existingMentee] = await con.query(
//     "SELECT * FROM mentees WHERE id = ? AND is_deleted = 0",
//     [id]
//   );

//   if (existingMentee.length === 0) {
//     return res
//       .status(404)
//       .json(new APIResponse(404, false, "Mentee not found", null));
//   }

//   const updatedMentee = {
//     university_number: university_number || existingMentee[0].university_number,
//     username: username || existingMentee[0].username,
//     full_name: full_name || existingMentee[0].full_name,
//     contact_number: contact_number || existingMentee[0].contact_number,
//     email: email || existingMentee[0].email,
//     address: address || existingMentee[0].address,
//     mentor_id: mentor_id || existingMentee[0].mentor_id,
//   };

//   // Only update password if provided
//   if (password) {
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json(
//           new APIResponse(
//             400,
//             false,
//             "Password must be at least 6 characters long",
//             null
//           )
//         );
//     }
//     updatedMentee.password = await bcrypt.hash(password, 10);
//   }

//   await con.query("UPDATE mentees SET ? WHERE id = ?", [updatedMentee, id]);

//   // Remove password from response
//   const responseData = { ...updatedMentee };
//   delete responseData.password;

//   res.json(
//     new APIResponse(200, true, "Mentee updated successfully", {
//       id,
//       ...responseData,
//     })
//   );
// });

// // DELETE - Soft delete a mentee
// const deleteMentee = asyncHandler(async (req, res) => {
//   const id = req.query.id;

//   if (!id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Mentee ID is required", null));
//   }

//   const [result] = await con.query(
//     "UPDATE mentees SET is_deleted = 1 WHERE id = ?",
//     [id]
//   );

//   if (result.affectedRows === 0) {
//     return res
//       .status(404)
//       .json(new APIResponse(404, false, "Mentee not found", null));
//   }

//   res.json(new APIResponse(200, true, "Mentee deleted successfully", null));
// });

// module.exports = {
//   getMentees,
//   addMentee,
//   updateMentee,
//   deleteMentee,
// };


// const con = require("../config/db.js");
// const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt");
// const { APIResponse } = require("../utils/APIResponses.js");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// // Create directory if it doesn't exist
// const uploadDir = path.join(process.cwd(), "uploads/mentors");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Use timestamp to create unique temporary filename
//     const timestamp = Date.now();
//     const ext = path.extname(file.originalname);
//     cb(null, `temp_${timestamp}${ext}`);
//   },
// });

// // Configure multer upload
// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype === "application/pdf" ||
//       file.mimetype.startsWith("image/")
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PDF and image files are allowed"));
//     }
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
// }).single("file_path");

// // GET - Retrieve mentors with pagination and search
// const getMentors = asyncHandler(async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
//     const offset = (page - 1) * rowsPerPage;
//     const searchColumn = req.query.filter || "full_name";
//     const searchWord = req.query.query;
//     const id = req.query.id;

//     // Validate search column to prevent SQL injection
//     const validColumns = ["full_name", "designation", "email_address", "contact_number", "qualification"];
//     const validatedSearchColumn = validColumns.includes(searchColumn) ? searchColumn : "full_name";

//     let query = "SELECT * FROM mentors WHERE is_deleted = 0";
//     let countQuery = "SELECT COUNT(*) as total FROM mentors WHERE is_deleted = 0";
//     const queryParams = [];

//     if (searchWord) {
//       const searchCondition = ` AND ${validatedSearchColumn} LIKE ?`;
//       query += searchCondition;
//       countQuery += searchCondition;
//       queryParams.push(`%${searchWord}%`);
//     }

//     if (id) {
//       const idCondition = " AND id = ?";
//       query += idCondition;
//       countQuery += idCondition;
//       queryParams.push(id);
//     }

//     query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
//     const paginationParams = [rowsPerPage, offset];

//     const [mentorsResult, countResult] = await Promise.all([
//       con.query(query, [...queryParams, ...paginationParams]),
//       con.query(countQuery, queryParams),
//     ]);

//     const totalMentors = countResult[0][0]?.total || 0;
//     const totalPages = Math.ceil(totalMentors / rowsPerPage);

//     // Map the results to format the file paths properly for the frontend
//     const mentors = mentorsResult[0].map(mentor => {
//       // Remove the password from the response
//       const { password, ...mentorData } = mentor;
      
//       // Format file path for frontend if it exists
//       if (mentorData.file_path) {
//         mentorData.file_path = mentorData.file_path.replace(/\\/g, '/').split('uploads/')[1] || mentorData.file_path;
//       }
      
//       return mentorData;
//     });

//     res.json(
//       new APIResponse(200, true, "Mentors retrieved successfully", {
//         mentors,
//         pagination: {
//           page,
//           rowsPerPage,
//           totalMentors,
//           totalPages,
//         },
//       })
//     );
//   } catch (error) {
//     console.error("Error retrieving mentors:", error);
//     res.status(500).json(
//       new APIResponse(500, false, "Error retrieving mentors", null)
//     );
//   }
// });

// // POST - Add a new mentor
// const addMentor = asyncHandler(async (req, res) => {
//   upload(req, res, async function (err) {
//     if (err) {
//       return res.status(400).json(
//         new APIResponse(400, false, err.message, null)
//       );
//     }

//     try {
//       const {
//         full_name,
//         designation,
//         email_address,
//         password,
//         contact_number,
//         qualification,
//       } = req.body;

//       if (
//         !full_name ||
//         !designation ||
//         !email_address ||
//         !password ||
//         !contact_number ||
//         !qualification
//       ) {
//         // Clean up temporary file if it exists
//         if (req.file) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res
//           .status(400)
//           .json(new APIResponse(400, false, "All fields are required", null));
//       }

//       if (password.length < 6) {
//         // Clean up temporary file if it exists
//         if (req.file) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res.status(400).json(
//           new APIResponse(
//             400,
//             false,
//             "Password must be at least 6 characters long",
//             null
//           )
//         );
//       }

//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email_address)) {
//         // Clean up temporary file if it exists
//         if (req.file && fs.existsSync(req.file.path)) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res.status(400).json(
//           new APIResponse(400, false, "Invalid email address format", null)
//         );
//       }

//       const [existingMentor] = await con.query(
//         "SELECT * FROM mentors WHERE email_address = ? AND is_deleted = 0",
//         [email_address]
//       );

//       if (existingMentor.length > 0) {
//         // Clean up temporary file if it exists
//         if (req.file && fs.existsSync(req.file.path)) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res.status(400).json(
//           new APIResponse(400, false, "Mentor with this email already exists", null)
//         );
//       }

//       // Process the uploaded file if exists
//       let filePath = null;
//       if (req.file) {
//         const fileExt = path.extname(req.file.originalname);
//         const newFileName = `mentor_${Date.now()}${fileExt}`;
//         const newFilePath = path.join(uploadDir, newFileName);

//         // Rename temp file to final name
//         fs.renameSync(req.file.path, newFilePath);
        
//         // Store relative path in database for easier access
//         filePath = `uploads/mentors/${newFileName}`;
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newMentor = {
//         full_name,
//         designation,
//         email_address,
//         password: hashedPassword,
//         contact_number,
//         qualification,
//         file_path: filePath,
//         is_deleted: 0,
//         created_at: new Date(),
//         updated_at: new Date()
//       };

//       const [result] = await con.query("INSERT INTO mentors SET ?", newMentor);

//       const responseData = { ...newMentor };
//       delete responseData.password;

//       res.status(201).json(
//         new APIResponse(201, true, "Mentor added successfully", {
//           id: result.insertId,
//           ...responseData,
//         })
//       );
//     } catch (error) {
//       // Clean up temporary file if it exists and there was an error
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       console.error("Upload error:", error);
//       res.status(500).json(
//         new APIResponse(500, false, "Error adding mentor", null)
//       );
//     }
//   });
// });

// // PUT - Update a mentor
// const updateMentor = asyncHandler(async (req, res) => {
//   upload(req, res, async function (err) {
//     if (err) {
//       return res.status(400).json(
//         new APIResponse(400, false, err.message, null)
//       );
//     }

//     try {
//       const {
//         id,
//         full_name,
//         designation,
//         email_address,
//         password,
//         contact_number,
//         qualification,
//       } = req.body;

//       if (!id) {
//         // Clean up temporary file if it exists
//         if (req.file && fs.existsSync(req.file.path)) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res
//           .status(400)
//           .json(new APIResponse(400, false, "Mentor ID is required", null));
//       }

//       const [existingMentor] = await con.query(
//         "SELECT * FROM mentors WHERE id = ? AND is_deleted = 0",
//         [id]
//       );

//       if (existingMentor.length === 0) {
//         // Clean up temporary file if it exists
//         if (req.file && fs.existsSync(req.file.path)) {
//           fs.unlinkSync(req.file.path);
//         }
//         return res
//           .status(404)
//           .json(new APIResponse(404, false, "Mentor not found", null));
//       }

//       // Validate email format if provided
//       if (email_address) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email_address)) {
//           // Clean up temporary file if it exists
//           if (req.file && fs.existsSync(req.file.path)) {
//             fs.unlinkSync(req.file.path);
//           }
//           return res.status(400).json(
//             new APIResponse(400, false, "Invalid email address format", null)
//           );
//         }
        
//         // Check if email is already in use by another mentor
//         const [emailExists] = await con.query(
//           "SELECT * FROM mentors WHERE email_address = ? AND id != ? AND is_deleted = 0",
//           [email_address, id]
//         );
        
//         if (emailExists.length > 0) {
//           // Clean up temporary file if it exists
//           if (req.file && fs.existsSync(req.file.path)) {
//             fs.unlinkSync(req.file.path);
//           }
//           return res.status(400).json(
//             new APIResponse(400, false, "Email address is already in use by another mentor", null)
//           );
//         }
//       }

//       // Process the uploaded file if exists
//       let filePath = existingMentor[0].file_path;
//       if (req.file) {
//         const fileExt = path.extname(req.file.originalname);
//         const newFileName = `mentor_${id}_${Date.now()}${fileExt}`;
//         const newFilePath = path.join(uploadDir, newFileName);

//         // Delete old file if it exists
//         if (
//           existingMentor[0].file_path &&
//           fs.existsSync(path.join(process.cwd(), existingMentor[0].file_path))
//         ) {
//           fs.unlinkSync(path.join(process.cwd(), existingMentor[0].file_path));
//         }

//         // Rename new file
//         fs.renameSync(req.file.path, newFilePath);
        
//         // Store relative path in database
//         filePath = `uploads/mentors/${newFileName}`;
//       }

//       const updatedMentor = {
//         full_name: full_name || existingMentor[0].full_name,
//         designation: designation || existingMentor[0].designation,
//         email_address: email_address || existingMentor[0].email_address,
//         contact_number: contact_number || existingMentor[0].contact_number,
//         qualification: qualification || existingMentor[0].qualification,
//         file_path: filePath,
//         updated_at: new Date()
//       };

//       if (password) {
//         if (password.length < 6) {
//           // Clean up temporary file if it exists
//           if (req.file && fs.existsSync(req.file.path)) {
//             fs.unlinkSync(req.file.path);
//           }
//           return res.status(400).json(
//             new APIResponse(
//               400,
//               false,
//               "Password must be at least 6 characters long",
//               null
//             )
//           );
//         }
//         updatedMentor.password = await bcrypt.hash(password, 10);
//       }

//       await con.query("UPDATE mentors SET ? WHERE id = ?", [updatedMentor, id]);

//       const responseData = { ...updatedMentor };
//       delete responseData.password;

//       res.json(
//         new APIResponse(200, true, "Mentor updated successfully", {
//           id,
//           ...responseData,
//         })
//       );
//     } catch (error) {
//       // Clean up temporary file if it exists and there was an error
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       console.error("Update error:", error);
//       res.status(500).json(
//         new APIResponse(500, false, "Error updating mentor", null)
//       );
//     }
//   });
// });

// // DELETE - Soft delete a mentor
// const deleteMentor = asyncHandler(async (req, res) => {
//   try {
//     const id = req.query.id;

//     if (!id) {
//       return res
//         .status(400)
//         .json(new APIResponse(400, false, "Mentor ID is required", null));
//     }

//     // Check if mentor exists
//     const [existingMentor] = await con.query(
//       "SELECT * FROM mentors WHERE id = ? AND is_deleted = 0",
//       [id]
//     );

//     if (existingMentor.length === 0) {
//       return res
//         .status(404)
//         .json(new APIResponse(404, false, "Mentor not found", null));
//     }

//     // Check if mentor has associated mentees
//     const [associatedMentees] = await con.query(
//       "SELECT COUNT(*) as count FROM mentees WHERE mentor_id = ? AND is_deleted = 0",
//       [id]
//     );

//     if (associatedMentees[0].count > 0) {
//       return res
//         .status(400)
//         .json(new APIResponse(400, false, "Cannot delete mentor with associated mentees", null));
//     }

//     const [result] = await con.query(
//       "UPDATE mentors SET is_deleted = 1, updated_at = ? WHERE id = ?",
//       [new Date(), id]
//     );

//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json(new APIResponse(404, false, "Mentor not found", null));
//     }

//     res.json(new APIResponse(200, true, "Mentor deleted successfully", null));
//   } catch (error) {
//     console.error("Delete error:", error);
//     res.status(500).json(
//       new APIResponse(500, false, "Error deleting mentor", null)
//     );
//   }
// });

// module.exports = {
//   getMentors,
//   addMentor,
//   updateMentor,
//   deleteMentor,
// };



const con = require("../config/db.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { APIResponse } = require("../utils/APIResponses.js");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create upload directory if not exists
const uploadDir = "uploads/mentees";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `temp_${timestamp}${ext}`);
  },
});

// Configure multer upload
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
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single("file_path");

// GET - Retrieve mentees
const getMentees = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
  const offset = (page - 1) * rowsPerPage;
  const searchColumn = req.query.filter || "full_name";
  const searchWord = req.query.query;
  const id = req.query.id;

  let query = "SELECT * FROM mentees WHERE is_deleted = 0";
  let countQuery = "SELECT COUNT(*) as total FROM mentees WHERE is_deleted = 0";
  const queryParams = [];

  if (searchWord) {
    const searchCondition = ` AND ${searchColumn} LIKE ?`;
    query += searchCondition;
    countQuery += searchCondition;
    queryParams.push(`%${searchWord}%`);
  }

  if (id) {
    query += " AND id = ?";
    countQuery += " AND id = ?";
    queryParams.push(id);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const paginationParams = [rowsPerPage, offset];

  const [menteesResult, countResult] = await Promise.all([
    con.query(query, [...queryParams, ...paginationParams]),
    con.query(countQuery, queryParams),
  ]);

  const totalMentees = countResult[0][0]?.total || 0;
  const totalPages = Math.ceil(totalMentees / rowsPerPage);

  res.json(
    new APIResponse(200, true, "Mentees retrieved successfully", {
      mentees: menteesResult[0],
      pagination: {
        page,
        rowsPerPage,
        totalMentees,
        totalPages,
      },
    })
  );
});

// POST - Add a new mentee
const addMentee = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json(
        new APIResponse(400, false, err.message, null)
      );
    }

    try {
      const {
        university_number,
        username,
        full_name,
        contact_number,
        email,
        password,
        address,
        mentor_id,
      } = req.body;

      if (
        !university_number ||
        !username ||
        !full_name ||
        !contact_number ||
        !email ||
        !password ||
        !address ||
        !mentor_id
      ) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json(new APIResponse(400, false, "All fields are required", null));
      }

      if (password.length < 6) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json(new APIResponse(400, false, "Password must be at least 6 characters long", null));
      }

      const [existing] = await con.query(
        "SELECT * FROM mentees WHERE email = ? OR username = ? OR university_number = ? AND is_deleted = 0",
        [email, username, university_number]
      );

      if (existing.length > 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json(new APIResponse(400, false, "Mentee already exists", null));
      }

      let filePath = null;
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newFileName = `mentee_${Date.now()}${ext}`;
        const newFilePath = path.join(uploadDir, newFileName);
        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newMentee = {
        university_number,
        username,
        full_name,
        contact_number,
        email,
        password: hashedPassword,
        address,
        mentor_id,
        file_path: filePath,
        is_deleted: 0,
      };

      const [result] = await con.query("INSERT INTO mentees SET ?", newMentee);

      const responseData = { ...newMentee };
      delete responseData.password;

      res.status(201).json(
        new APIResponse(201, true, "Mentee added successfully", {
          id: result.insertId,
          ...responseData,
        })
      );
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Add mentee error:", error);
      res.status(500).json(new APIResponse(500, false, "Error adding mentee", null));
    }
  });
});

// PUT - Update a mentee
const updateMentee = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json(
        new APIResponse(400, false, err.message, null)
      );
    }

    try {
      const {
        id,
        university_number,
        username,
        full_name,
        contact_number,
        email,
        password,
        address,
        mentor_id,
      } = req.body;

      if (!id) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json(new APIResponse(400, false, "Mentee ID is required", null));
      }

      const [existing] = await con.query("SELECT * FROM mentees WHERE id = ? AND is_deleted = 0", [id]);

      if (existing.length === 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res
          .status(404)
          .json(new APIResponse(404, false, "Mentee not found", null));
      }

      let filePath = existing[0].file_path;
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newFileName = `mentee_${id}_${Date.now()}${ext}`;
        const newFilePath = path.join(uploadDir, newFileName);
        if (existing[0].file_path && fs.existsSync(existing[0].file_path)) {
          fs.unlinkSync(existing[0].file_path);
        }
        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      const updatedMentee = {
        university_number: university_number || existing[0].university_number,
        username: username || existing[0].username,
        full_name: full_name || existing[0].full_name,
        contact_number: contact_number || existing[0].contact_number,
        email: email || existing[0].email,
        address: address || existing[0].address,
        mentor_id: mentor_id || existing[0].mentor_id,
        file_path: filePath,
      };

      if (password) {
        if (password.length < 6) {
          return res
            .status(400)
            .json(new APIResponse(400, false, "Password must be at least 6 characters long", null));
        }
        updatedMentee.password = await bcrypt.hash(password, 10);
      }

      await con.query("UPDATE mentees SET ? WHERE id = ?", [updatedMentee, id]);

      const responseData = { ...updatedMentee };
      delete responseData.password;

      res.json(
        new APIResponse(200, true, "Mentee updated successfully", {
          id,
          ...responseData,
        })
      );
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Update error:", error);
      res.status(500).json(new APIResponse(500, false, "Error updating mentee", null));
    }
  });
});

// DELETE - Soft delete a mentee
const deleteMentee = asyncHandler(async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Mentee ID is required", null));
  }

  const [result] = await con.query(
    "UPDATE mentees SET is_deleted = 1 WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json(new APIResponse(404, false, "Mentee not found", null));
  }

  res.json(new APIResponse(200, true, "Mentee deleted successfully", null));
});

module.exports = {
  getMentees,
  addMentee,
  updateMentee,
  deleteMentee,
};
