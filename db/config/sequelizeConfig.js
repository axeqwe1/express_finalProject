const { Sequelize } = require('sequelize');
//อันนี้เป็นส่วนที่ใช้ในการบอก Sequelize ว่าเราจะ connect ไปที่ Database ไหน
const sequelize = new Sequelize("repaircomputer_db", "root", "root", 
  {
    host: "45.136.255.62",
    dialect: "mysql",
    port:8006,
    timezone: '+07:00'
  });

  module.exports = sequelize

// //----------------------------------------------------------กรณีไม่ได้ใช้Host แล้ว
//   const { Sequelize } = require('sequelize');
// // อันนี้เป็นส่วนที่ใช้ในการบอก Sequelize ว่าจะ connect ไปที่ Database ไหน
// const sequelize = new Sequelize("repaircomputer_db", "root", "root", {
//     host: "db", // ใช้ชื่อ service ใน Docker Compose แทน IP address
//     dialect: "mysql",
//     port: 3306, // ใช้พอร์ตภายใน Docker (ปกติจะเป็น 3306)
//     timezone: '+07:00'
// });

// module.exports = sequelize;