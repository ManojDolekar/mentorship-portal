// const con = require("../config/db.js");
// const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt");
// const { APIResponse } = require("../utils/APIResponses.js");

// // GET - Retrieve mentors with pagination and search
// const getMentors = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
//   const offset = (page - 1) * rowsPerPage;
//   const searchColumn = req.query.filter || "full_name";
//   const searchWord = req.query.query;
//   const id = req.query.id;

//   let query = "SELECT * FROM mentors WHERE is_deleted = 0";
//   let countQuery = "SELECT COUNT(*) as total FROM mentors WHERE is_deleted = 0";
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

//   query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
//   const paginationParams = [rowsPerPage, offset];

//   const [mentorsResult, countResult] = await Promise.all([
//     con.query(query, [...queryParams, ...paginationParams]),
//     con.query(countQuery, queryParams),
//   ]);

//   const totalMentors = countResult[0][0]?.total || 0;
//   const totalPages = Math.ceil(totalMentors / rowsPerPage);

//   res.json(
//     new APIResponse(200, true, "Mentors retrieved successfully", {
//       mentors: mentorsResult[0],
//       pagination: {
//         page,
//         rowsPerPage,
//         totalMentors,
//         totalPages,
//       },
//     })
//   );
// });

// // POST - Add a new mentor
// const addMentor = asyncHandler(async (req, res) => {
//   const {
//     full_name,
//     designation,
//     email_address,
//     password, // New field
//     contact_number,
//     qualification,
//   } = req.body;

//   if (
//     !full_name ||
//     !designation ||
//     !email_address ||
//     !password ||
//     !contact_number ||
//     !qualification
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

//   const [existingMentor] = await con.query(
//     "SELECT * FROM mentors WHERE email_address = ? AND is_deleted = 0",
//     [email_address]
//   );

//   if (existingMentor.length > 0) {
//     return res
//       .status(400)
//       .json(
//         new APIResponse(
//           400,
//           false,
//           "Mentor with this email already exists",
//           null
//         )
//       );
//   }

//   // Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newMentor = {
//     full_name,
//     designation,
//     email_address,
//     password: hashedPassword, // Store hashed password
//     contact_number,
//     qualification,
//     is_deleted: 0,
//   };

//   const [result] = await con.query("INSERT INTO mentors SET ?", newMentor);

//   // Remove password from response
//   const responseData = { ...newMentor };
//   delete responseData.password;

//   res.status(201).json(
//     new APIResponse(201, true, "Mentor added successfully", {
//       id: result.insertId,
//       ...responseData,
//     })
//   );
// });

// // PUT - Update a mentor
// const updateMentor = asyncHandler(async (req, res) => {
//   const {
//     id,
//     full_name,
//     designation,
//     email_address,
//     password, // New field
//     contact_number,
//     qualification,
//   } = req.body;

//   if (!id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Mentor ID is required", null));
//   }

//   const [existingMentor] = await con.query(
//     "SELECT * FROM mentors WHERE id = ? AND is_deleted = 0",
//     [id]
//   );

//   if (existingMentor.length === 0) {
//     return res
//       .status(404)
//       .json(new APIResponse(404, false, "Mentor not found", null));
//   }

//   const updatedMentor = {
//     full_name: full_name || existingMentor[0].full_name,
//     designation: designation || existingMentor[0].designation,
//     email_address: email_address || existingMentor[0].email_address,
//     contact_number: contact_number || existingMentor[0].contact_number,
//     qualification: qualification || existingMentor[0].qualification,
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
//     updatedMentor.password = await bcrypt.hash(password, 10);
//   }

//   await con.query("UPDATE mentors SET ? WHERE id = ?", [updatedMentor, id]);

//   // Remove password from response
//   const responseData = { ...updatedMentor };
//   delete responseData.password;

//   res.json(
//     new APIResponse(200, true, "Mentor updated successfully", {
//       id,
//       ...responseData,
//     })
//   );
// });

// // DELETE - Soft delete a mentor
// const deleteMentor = asyncHandler(async (req, res) => {
//   const id = req.query.id;

//   if (!id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Mentor ID is required", null));
//   }

//   const [result] = await con.query(
//     "UPDATE mentors SET is_deleted = 1 WHERE id = ?",
//     [id]
//   );

//   if (result.affectedRows === 0) {
//     return res
//       .status(404)
//       .json(new APIResponse(404, false, "Mentor not found", null));
//   }

//   res.json(new APIResponse(200, true, "Mentor deleted successfully", null));
// });

// module.exports = {
//   getMentors,
//   addMentor,
//   updateMentor,
//   deleteMentor,
// };



// const con = require("../config/db.js");
// const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt");
// const { APIResponse } = require("../utils/APIResponses.js");

// // GET - Retrieve mentors with pagination and search
// const getMentors = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
//   const offset = (page - 1) * rowsPerPage;
//   const searchColumn = req.query.filter || "full_name";
//   const searchWord = req.query.query;
//   const id = req.query.id;

//   let query = "SELECT * FROM mentors WHERE is_deleted = 0";
//   let countQuery = "SELECT COUNT(*) as total FROM mentors WHERE is_deleted = 0";
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

//   query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
//   const paginationParams = [rowsPerPage, offset];

//   const [mentorsResult, countResult] = await Promise.all([
//     con.query(query, [...queryParams, ...paginationParams]),
//     con.query(countQuery, queryParams),
//   ]);

//   const totalMentors = countResult[0][0]?.total || 0;
//   const totalPages = Math.ceil(totalMentors / rowsPerPage);

//   res.json(
//     new APIResponse(200, true, "Mentors retrieved successfully", {
//       mentors: mentorsResult[0],
//       pagination: {
//         page,
//         rowsPerPage,
//         totalMentors,
//         totalPages,
//       },
//     })
//   );
// });

// // POST - Add a new mentor
// const addMentor = asyncHandler(async (req, res) => {
//   const {
//     full_name,
//     designation,
//     email_address,
//     password,
//     contact_number,
//     qualification,
//   } = req.body;

//   const file_path = req.file ? req.file.filename : null;

//   if (
//     !full_name ||
//     !designation ||
//     !email_address ||
//     !password ||
//     !contact_number ||
//     !qualification
//   ) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "All fields are required", null));
//   }

//   if (password.length < 6) {
//     return res.status(400).json(
//       new APIResponse(
//         400,
//         false,
//         "Password must be at least 6 characters long",
//         null
//       )
//     );
//   }

//   const [existingMentor] = await con.query(
//     "SELECT * FROM mentors WHERE email_address = ? AND is_deleted = 0",
//     [email_address]
//   );

//   if (existingMentor.length > 0) {
//     return res.status(400).json(
//       new APIResponse(400, false, "Mentor with this email already exists", null)
//     );
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newMentor = {
//     full_name,
//     designation,
//     email_address,
//     password: hashedPassword,
//     contact_number,
//     qualification,
//     file_path,
//     is_deleted: 0,
//   };

//   const [result] = await con.query("INSERT INTO mentors SET ?", newMentor);

//   const responseData = { ...newMentor };
//   delete responseData.password;

//   res.status(201).json(
//     new APIResponse(201, true, "Mentor added successfully", {
//       id: result.insertId,
//       ...responseData,
//     })
//   );
// });

// // PUT - Update a mentor
// const updateMentor = asyncHandler(async (req, res) => {
//   const {
//     id,
//     full_name,
//     designation,
//     email_address,
//     password,
//     contact_number,
//     qualification,
//   } = req.body;

//   const file_path = req.file ? req.file.filename : null;

//   if (!id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Mentor ID is required", null));
//   }

//   const [existingMentor] = await con.query(
//     "SELECT * FROM mentors WHERE id = ? AND is_deleted = 0",
//     [id]
//   );

//   if (existingMentor.length === 0) {
//     return res
//       .status(404)
//       .json(new APIResponse(404, false, "Mentor not found", null));
//   }

//   const updatedMentor = {
//     full_name: full_name || existingMentor[0].full_name,
//     designation: designation || existingMentor[0].designation,
//     email_address: email_address || existingMentor[0].email_address,
//     contact_number: contact_number || existingMentor[0].contact_number,
//     qualification: qualification || existingMentor[0].qualification,
//     file_path: file_path || existingMentor[0].file_path,
//   };

//   if (password) {
//     if (password.length < 6) {
//       return res.status(400).json(
//         new APIResponse(
//           400,
//           false,
//           "Password must be at least 6 characters long",
//           null
//         )
//       );
//     }
//     updatedMentor.password = await bcrypt.hash(password, 10);
//   }

//   await con.query("UPDATE mentors SET ? WHERE id = ?", [updatedMentor, id]);

//   const responseData = { ...updatedMentor };
//   delete responseData.password;

//   res.json(
//     new APIResponse(200, true, "Mentor updated successfully", {
//       id,
//       ...responseData,
//     })
//   );
// });

// // DELETE - Soft delete a mentor
// const deleteMentor = asyncHandler(async (req, res) => {
//   const id = req.query.id;

//   if (!id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Mentor ID is required", null));
//   }

//   const [result] = await con.query(
//     "UPDATE mentors SET is_deleted = 1 WHERE id = ?",
//     [id]
//   );

//   if (result.affectedRows === 0) {
//     return res
//       .status(404)
//       .json(new APIResponse(404, false, "Mentor not found", null));
//   }

//   res.json(new APIResponse(200, true, "Mentor deleted successfully", null));
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

// Create directory if it doesn't exist
const uploadDir = "uploads/mentors";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("file_path");

// GET - Retrieve mentors with pagination and search
const getMentors = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
  const offset = (page - 1) * rowsPerPage;
  const searchColumn = req.query.filter || "full_name";
  const searchWord = req.query.query;
  const id = req.query.id;

  let query = "SELECT * FROM mentors WHERE is_deleted = 0";
  let countQuery = "SELECT COUNT(*) as total FROM mentors WHERE is_deleted = 0";
  const queryParams = [];

  if (searchWord) {
    const searchCondition = ` AND ${searchColumn} LIKE ?`;
    query += searchCondition;
    countQuery += searchCondition;
    queryParams.push(`%${searchWord}%`);
  }

  if (id) {
    const idCondition = " AND id = ?";
    query += idCondition;
    countQuery += idCondition;
    queryParams.push(id);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const paginationParams = [rowsPerPage, offset];

  const [mentorsResult, countResult] = await Promise.all([
    con.query(query, [...queryParams, ...paginationParams]),
    con.query(countQuery, queryParams),
  ]);

  const totalMentors = countResult[0][0]?.total || 0;
  const totalPages = Math.ceil(totalMentors / rowsPerPage);

  res.json(
    new APIResponse(200, true, "Mentors retrieved successfully", {
      mentors: mentorsResult[0],
      pagination: {
        page,
        rowsPerPage,
        totalMentors,
        totalPages,
      },
    })
  );
});

// POST - Add a new mentor
const addMentor = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json(
        new APIResponse(400, false, err.message, null)
      );
    }

    try {
      const {
        full_name,
        designation,
        email_address,
        password,
        contact_number,
        qualification,
      } = req.body;

      if (
        !full_name ||
        !designation ||
        !email_address ||
        !password ||
        !contact_number ||
        !qualification
      ) {
        // Clean up temporary file if it exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json(new APIResponse(400, false, "All fields are required", null));
      }

      if (password.length < 6) {
        // Clean up temporary file if it exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json(
          new APIResponse(
            400,
            false,
            "Password must be at least 6 characters long",
            null
          )
        );
      }

      const [existingMentor] = await con.query(
        "SELECT * FROM mentors WHERE email_address = ? AND is_deleted = 0",
        [email_address]
      );

      if (existingMentor.length > 0) {
        // Clean up temporary file if it exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json(
          new APIResponse(400, false, "Mentor with this email already exists", null)
        );
      }

      // Process the uploaded file if exists
      let filePath = null;
      if (req.file) {
        const fileExt = path.extname(req.file.originalname);
        const newFileName = `mentor_${Date.now()}${fileExt}`;
        const newFilePath = path.join(uploadDir, newFileName);

        // Rename temp file to final name
        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newMentor = {
        full_name,
        designation,
        email_address,
        password: hashedPassword,
        contact_number,
        qualification,
        file_path: filePath,
        is_deleted: 0,
      };

      const [result] = await con.query("INSERT INTO mentors SET ?", newMentor);

      const responseData = { ...newMentor };
      delete responseData.password;

      res.status(201).json(
        new APIResponse(201, true, "Mentor added successfully", {
          id: result.insertId,
          ...responseData,
        })
      );
    } catch (error) {
      // Clean up temporary file if it exists and there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Upload error:", error);
      res.status(500).json(
        new APIResponse(500, false, "Error adding mentor", null)
      );
    }
  });
});

// PUT - Update a mentor
const updateMentor = asyncHandler(async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json(
        new APIResponse(400, false, err.message, null)
      );
    }

    try {
      const {
        id,
        full_name,
        designation,
        email_address,
        password,
        contact_number,
        qualification,
      } = req.body;

      if (!id) {
        // Clean up temporary file if it exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(400)
          .json(new APIResponse(400, false, "Mentor ID is required", null));
      }

      const [existingMentor] = await con.query(
        "SELECT * FROM mentors WHERE id = ? AND is_deleted = 0",
        [id]
      );

      if (existingMentor.length === 0) {
        // Clean up temporary file if it exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(404)
          .json(new APIResponse(404, false, "Mentor not found", null));
      }

      // Process the uploaded file if exists
      let filePath = existingMentor[0].file_path;
      if (req.file) {
        const fileExt = path.extname(req.file.originalname);
        const newFileName = `mentor_${id}_${Date.now()}${fileExt}`;
        const newFilePath = path.join(uploadDir, newFileName);

        // Delete old file if it exists
        if (
          existingMentor[0].file_path &&
          fs.existsSync(existingMentor[0].file_path)
        ) {
          fs.unlinkSync(existingMentor[0].file_path);
        }

        // Rename new file
        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      }

      const updatedMentor = {
        full_name: full_name || existingMentor[0].full_name,
        designation: designation || existingMentor[0].designation,
        email_address: email_address || existingMentor[0].email_address,
        contact_number: contact_number || existingMentor[0].contact_number,
        qualification: qualification || existingMentor[0].qualification,
        file_path: filePath,
      };

      if (password) {
        if (password.length < 6) {
          return res.status(400).json(
            new APIResponse(
              400,
              false,
              "Password must be at least 6 characters long",
              null
            )
          );
        }
        updatedMentor.password = await bcrypt.hash(password, 10);
      }

      await con.query("UPDATE mentors SET ? WHERE id = ?", [updatedMentor, id]);

      const responseData = { ...updatedMentor };
      delete responseData.password;

      res.json(
        new APIResponse(200, true, "Mentor updated successfully", {
          id,
          ...responseData,
        })
      );
    } catch (error) {
      // Clean up temporary file if it exists and there was an error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Update error:", error);
      res.status(500).json(
        new APIResponse(500, false, "Error updating mentor", null)
      );
    }
  });
});

// DELETE - Soft delete a mentor
const deleteMentor = asyncHandler(async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Mentor ID is required", null));
  }

  const [result] = await con.query(
    "UPDATE mentors SET is_deleted = 1 WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json(new APIResponse(404, false, "Mentor not found", null));
  }

  res.json(new APIResponse(200, true, "Mentor deleted successfully", null));
});

module.exports = {
  getMentors,
  addMentor,
  updateMentor,
  deleteMentor,
};