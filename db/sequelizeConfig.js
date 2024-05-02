const { Sequelize } = require('sequelize');

//อันนี้เป็นส่วนที่ใช้ในการบอก Sequelize ว่าเราจะ connect ไปที่ไหน
const sequelize = new Sequelize("repaircomputer_db", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    port:8006,
  });

  module.exports = sequelize