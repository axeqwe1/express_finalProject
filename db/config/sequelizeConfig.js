const { Sequelize } = require('sequelize');
//อันนี้เป็นส่วนที่ใช้ในการบอก Sequelize ว่าเราจะ connect ไปที่ Database ไหน
const sequelize = new Sequelize("repaircomputer_db", "root", "root", 
  {
    host: "localhost",
    dialect: "mysql",
    port:8006,
    timezone: '+07:00'
  });

  module.exports = sequelize