const con = require("../config/db.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { APIResponse } = require("../utils/APIResponses.js");

// GET - Retrieve admins with pagination and search
const getAdmins = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
  const offset = (page - 1) * rowsPerPage;
  const searchColumn = req.query.filter || "username";
  const searchWord = req.query.query;
  const id = req.query.id;

  let query = "SELECT * FROM admins WHERE is_deleted = 0";
  let countQuery = "SELECT COUNT(*) as total FROM admins WHERE is_deleted = 0";
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

  const [adminsResult, countResult] = await Promise.all([
    con.query(query, [...queryParams, ...paginationParams]),
    con.query(countQuery, queryParams),
  ]);

  const totalAdmins = countResult[0][0]?.total || 0;
  const totalPages = Math.ceil(totalAdmins / rowsPerPage);

  // Remove passwords from response
  const admins = adminsResult[0].map((admin) => {
    const adminData = { ...admin };
    delete adminData.password;
    return adminData;
  });

  res.json(
    new APIResponse(200, true, "Admins retrieved successfully", {
      admins,
      pagination: {
        page,
        rowsPerPage,
        totalAdmins,
        totalPages,
      },
    })
  );
});

// POST - Add a new admin
const addAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "All fields are required", null));
  }

  // Validate password strength
  if (password.length < 6) {
    return res
      .status(400)
      .json(
        new APIResponse(
          400,
          false,
          "Password must be at least 6 characters long",
          null
        )
      );
  }

  const [existingAdmin] = await con.query(
    "SELECT * FROM admins WHERE email = ? AND is_deleted = 0",
    [email]
  );

  if (existingAdmin.length > 0) {
    return res
      .status(400)
      .json(
        new APIResponse(
          400,
          false,
          "Admin with this email already exists",
          null
        )
      );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = {
    username,
    email,
    password: hashedPassword,
    is_deleted: 0, // Default is_deleted flag
  };

  const [result] = await con.query("INSERT INTO admins SET ?", newAdmin);

  // Remove password from response
  const responseData = { ...newAdmin };
  delete responseData.password;

  res.status(201).json(
    new APIResponse(201, true, "Admin added successfully", {
      id: result.insertId,
      ...responseData,
    })
  );
});

// PUT - Update an admin
const updateAdmin = asyncHandler(async (req, res) => {
  const { id, username, email, password } = req.body;

  if (!id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Admin ID is required", null));
  }

  const [existingAdmin] = await con.query(
    "SELECT * FROM admins WHERE id = ? AND is_deleted = 0",
    [id]
  );

  if (existingAdmin.length === 0) {
    return res
      .status(404)
      .json(new APIResponse(404, false, "Admin not found", null));
  }

  const updatedAdmin = {
    username: username || existingAdmin[0].username,
    email: email || existingAdmin[0].email,
  };

  // Only update password if provided
  if (password) {
    if (password.length < 6) {
      return res
        .status(400)
        .json(
          new APIResponse(
            400,
            false,
            "Password must be at least 6 characters long",
            null
          )
        );
    }
    updatedAdmin.password = await bcrypt.hash(password, 10);
  }

  await con.query("UPDATE admins SET ? WHERE id = ?", [updatedAdmin, id]);

  // Remove password from response
  const responseData = { ...updatedAdmin };
  delete responseData.password;

  res.json(
    new APIResponse(200, true, "Admin updated successfully", {
      id,
      ...responseData,
    })
  );
});

// DELETE - Soft delete an admin
const deleteAdmin = asyncHandler(async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res
      .status(400)
      .json(new APIResponse(400, false, "Admin ID is required", null));
  }

  const [result] = await con.query(
    "UPDATE admins SET is_deleted = 1 WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    return res
      .status(404)
      .json(new APIResponse(404, false, "Admin not found", null));
  }

  res.json(new APIResponse(200, true, "Admin deleted successfully", null));
});

module.exports = {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
};



// const con = require("../config/db.js");
// const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt");
// const { APIResponse } = require("../utils/APIResponses.js");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// // Create directory if it doesn't exist
// const uploadDir = "uploads/admins";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const timestamp = Date.now();
//     const ext = path.extname(file.originalname);
//     cb(null, `admin_${timestamp}${ext}`);
//   },
// });

// // Configure multer upload
// const upload = multer({
//   storage,
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

// // GET - Retrieve admins with pagination and search
// const getAdmins = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const rowsPerPage = parseInt(req.query.rowsPerPage) || 10;
//   const offset = (page - 1) * rowsPerPage;
//   const searchColumn = req.query.filter || "username";
//   const searchWord = req.query.query;
//   const id = req.query.id;

//   let query = "SELECT * FROM admins WHERE is_deleted = 0";
//   let countQuery = "SELECT COUNT(*) as total FROM admins WHERE is_deleted = 0";
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

//   const [adminsResult, countResult] = await Promise.all([
//     con.query(query, [...queryParams, ...paginationParams]),
//     con.query(countQuery, queryParams),
//   ]);

//   const totalAdmins = countResult[0][0]?.total || 0;
//   const totalPages = Math.ceil(totalAdmins / rowsPerPage);

//   const admins = adminsResult[0].map((admin) => {
//     const adminData = { ...admin };
//     delete adminData.password;
//     return adminData;
//   });

//   res.json(
//     new APIResponse(200, true, "Admins retrieved successfully", {
//       admins,
//       pagination: {
//         page,
//         rowsPerPage,
//         totalAdmins,
//         totalPages,
//       },
//     })
//   );
// });

// // POST - Add a new admin
// const addAdmin = asyncHandler(async (req, res) => {
//   upload(req, res, async function (err) {
//     if (err) {
//       return res
//         .status(400)
//         .json(new APIResponse(400, false, err.message, null));
//     }

//     try {
//       const { username, email, password } = req.body;

//       if (!username || !email || !password) {
//         if (req.file) fs.unlinkSync(req.file.path);
//         return res
//           .status(400)
//           .json(new APIResponse(400, false, "All fields are required", null));
//       }

//       if (password.length < 6) {
//         if (req.file) fs.unlinkSync(req.file.path);
//         return res.status(400).json(
//           new APIResponse(
//             400,
//             false,
//             "Password must be at least 6 characters long",
//             null
//           )
//         );
//       }

//       const [existingAdmin] = await con.query(
//         "SELECT * FROM admins WHERE email = ? AND is_deleted = 0",
//         [email]
//       );

//       if (existingAdmin.length > 0) {
//         if (req.file) fs.unlinkSync(req.file.path);
//         return res
//           .status(400)
//           .json(
//             new APIResponse(
//               400,
//               false,
//               "Admin with this email already exists",
//               null
//             )
//           );
//       }

//       let filePath = null;
//       if (req.file) {
//         const ext = path.extname(req.file.originalname);
//         const newFileName = `admin_${Date.now()}${ext}`;
//         const newFilePath = path.join(uploadDir, newFileName);
//         fs.renameSync(req.file.path, newFilePath);
//         filePath = newFilePath;
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newAdmin = {
//         username,
//         email,
//         password: hashedPassword,
//         file_path: filePath,
//         is_deleted: 0,
//       };

//       const [result] = await con.query("INSERT INTO admins SET ?", newAdmin);

//       const responseData = { ...newAdmin };
//       delete responseData.password;

//       res.status(201).json(
//         new APIResponse(201, true, "Admin added successfully", {
//           id: result.insertId,
//           ...responseData,
//         })
//       );
//     } catch (error) {
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       console.error("Add admin error:", error);
//       res
//         .status(500)
//         .json(new APIResponse(500, false, "Error adding admin", null));
//     }
//   });
// });

// // PUT - Update an admin
// const updateAdmin = asyncHandler(async (req, res) => {
//   upload(req, res, async function (err) {
//     if (err) {
//       return res
//         .status(400)
//         .json(new APIResponse(400, false, err.message, null));
//     }

//     try {
//       const { id, username, email, password } = req.body;

//       if (!id) {
//         if (req.file) fs.unlinkSync(req.file.path);
//         return res
//           .status(400)
//           .json(new APIResponse(400, false, "Admin ID is required", null));
//       }

//       const [existingAdmin] = await con.query(
//         "SELECT * FROM admins WHERE id = ? AND is_deleted = 0",
//         [id]
//       );

//       if (existingAdmin.length === 0) {
//         if (req.file) fs.unlinkSync(req.file.path);
//         return res
//           .status(404)
//           .json(new APIResponse(404, false, "Admin not found", null));
//       }

//       let filePath = existingAdmin[0].file_path;
//       if (req.file) {
//         const ext = path.extname(req.file.originalname);
//         const newFileName = `admin_${id}_${Date.now()}${ext}`;
//         const newFilePath = path.join(uploadDir, newFileName);

//         if (existingAdmin[0].file_path && fs.existsSync(existingAdmin[0].file_path)) {
//           fs.unlinkSync(existingAdmin[0].file_path);
//         }

//         fs.renameSync(req.file.path, newFilePath);
//         filePath = newFilePath;
//       }

//       const updatedAdmin = {
//         username: username || existingAdmin[0].username,
//         email: email || existingAdmin[0].email,
//         file_path: filePath,
//       };

//       if (password) {
//         if (password.length < 6) {
//           return res.status(400).json(
//             new APIResponse(
//               400,
//               false,
//               "Password must be at least 6 characters long",
//               null
//             )
//           );
//         }
//         updatedAdmin.password = await bcrypt.hash(password, 10);
//       }

//       await con.query("UPDATE admins SET ? WHERE id = ?", [updatedAdmin, id]);

//       const responseData = { ...updatedAdmin };
//       delete responseData.password;

//       res.json(
//         new APIResponse(200, true, "Admin updated successfully", {
//           id,
//           ...responseData,
//         })
//       );
//     } catch (error) {
//       if (req.file && fs.existsSync(req.file.path)) {
//         fs.unlinkSync(req.file.path);
//       }
//       console.error("Update admin error:", error);
//       res
//         .status(500)
//         .json(new APIResponse(500, false, "Error updating admin", null));
//     }
//   });
// });

// // DELETE - Soft delete an admin
// const deleteAdmin = asyncHandler(async (req, res) => {
//   const id = req.query.id;

//   if (!id) {
//     return res
//       .status(400)
//       .json(new APIResponse(400, false, "Admin ID is required", null));
//   }

//   const [result] = await con.query(
//     "UPDATE admins SET is_deleted = 1 WHERE id = ?",
//     [id]
//   );

//   if (result.affectedRows === 0) {
//     return res
//       .status(404)
//       .json(new APIResponse(404, false, "Admin not found", null));
//   }

//   res.json(new APIResponse(200, true, "Admin deleted successfully", null));
// });

// module.exports = {
//   getAdmins,
//   addAdmin,
//   updateAdmin,
//   deleteAdmin,
// };
