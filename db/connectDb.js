const mysql = require("mysql2/promise");
let conn = null;

const initMySQL = async () => {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      port: 8006,
      password: "root",
      database: "repaircomputer_db",
    });
  };
module.exports = initMySQL()