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
  // db.admin = require("./model/admin")(sequelize);
  // db.department = require("./model/department")(sequelize);
  // db.employee = require("./model/employee")(sequelize);
  // db.technician = require("./model/technician")(sequelize);
  // db.chief = require("./model/chief")(sequelize);
  // db.technicianStatus = require("./model/technician_status")(sequelize);
  // db.notification = require("./model/notification")(sequelize);
  // db.equipment = require('./model/equipment.js')(sequelize);
  // db.equipmentType = require('./model/equipment_type.js')(sequelize);
  // db.building = require('./model/building.js')(sequelize);
  // db.levelOfDamage = require('./model/levelOfDamage.js')(sequelize);
  // db.requestForRepair = require('./model/requestForRepair.js')(sequelize)
  // db.receiveRepair = require('./model/receiveRepair.js')(sequelize)
  // db.repairDetail = require('./model/repairDetails.js')(sequelize)
  // db.assignWork = require('./model/assignWork.js')(sequelize)
  // // Define associations to Departments
  // db.admin.belongsTo(db.department, { foreignKey: {name:'departmentId',allowNull: false}, }); 
  // db.employee.belongsTo(db.department, { foreignKey: {name:'departmentId',allowNull: false},  });
  // db.technician.belongsTo(db.department, { foreignKey: {name:'departmentId',allowNull: false},  });
  // db.chief.belongsTo(db.department, {foreignKey:{name:'departmentId',allowNull: false},})
  // db.technician.belongsTo(db.technicianStatus, { foreignKey: {name:'techStatusId',allowNull: false},  });
  // // Define associations Notification
  // db.notification.belongsTo(db.technician, { foreignKey: 'technicianId',});
  // db.notification.belongsTo(db.employee, { foreignKey: 'employeeId', });
  // db.notification.belongsTo(db.admin, { foreignKey: 'adminId', });
  // // Define associations Equipment To EquipmentType
  // db.equipment.belongsTo(db.equipmentType,{foreignKey:{name:'eqc_id',allowNull: false},})
  // // Define associations repair_request
  // db.requestForRepair.belongsTo(db.employee,{foreignKey:{name:'employee_id',allowNull: false},})
  // db.requestForRepair.belongsTo(db.building,{foreignKey:{name:'building_id',allowNull: false},})
  // db.requestForRepair.belongsTo(db.equipment,{foreignKey:{name:'eq_id',allowNull: false},})
  // // Define associations AssignWork
  // // Admin มีหลาย AssignWork
  // db.assignWork.belongsTo(db.admin, { foreignKey: {name:'admin_id',allowNull: false} });
  //   // Technician มีหลาย AssignWork
  // db.assignWork.belongsTo(db.technician, { foreignKey: {name:'tech_id',allowNull: false} });
  //   // RequestForRepair มีหนึ่ง AssignWork
  // db.assignWork.belongsTo(db.requestForRepair, { foreignKey: {name:'rrid',allowNull: false} });
  //   // Define associations receive_repair

  //     // Define associations receive_repair
  // db.receiveRepair.belongsTo(db.requestForRepair, { foreignKey: {name:'rrid',allowNull: false} });
  db.user = require('./model/test/user')(sequelize)
  db.profile = require('./model/test/profile')(sequelize)
  // profileid จะไปโผล่ใน table user เพื่อไปเป็น FK
  db.user.belongsTo(db.profile);
  db.profile.hasOne(db.user);
  module.exports = db;
