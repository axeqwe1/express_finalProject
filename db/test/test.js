const { Sequelize } = require('sequelize');

//อันนี้เป็นส่วนที่ใช้ในการบอก Sequelize ว่าเราจะ connect ไปที่ไหน
const sequelize = new Sequelize("repaircomputer_db", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    port:8006,
  });

  const db = {};
  // กำหนด properties sequelize ของ db เก็บ object sequelize ด้านบน
  db.sequelize = sequelize;

  // //ส่วนนี้เป็นการ import model ของ table ใน database เข้ามาเพื่อตั้งต่า relation
  db.user = require('./user')(sequelize)
  db.profile = require('./profile')(sequelize)
  // profileid จะไปโผล่ใน table user เพื่อไปเป็น FK
  db.user.belongsTo(db.profile);
  db.profile.hasOne(db.user);
  module.exports = db;
