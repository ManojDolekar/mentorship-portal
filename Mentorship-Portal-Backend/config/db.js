const mysql = require("mysql2/promise");

const con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "mentorship_portal",
  connectionLimit: 10,
});

module.exports = con;
