const sequelize = require('./config/sequelizeConfig.js')
const db = {};
// กำหนด properties sequelize ของ db เก็บ object sequelize ด้านบน
db.sequelize = sequelize;

//ส่วนนี้เป็นการ import model ของ table ใน database เข้ามาเพื่อตั้งต่า relation
db.admin = require("./model/admin")(sequelize);
db.department = require("./model/department")(sequelize);
db.employee = require("./model/employee")(sequelize);
db.technician = require("./model/technician")(sequelize);
db.chief = require("./model/chief")(sequelize);
db.technicianStatus = require("./model/technician_status")(sequelize);
db.notification = require("./model/notification")(sequelize);
db.equipment = require('./model/equipment.js')(sequelize);
db.equipmentType = require('./model/equipment_type.js')(sequelize);
db.building = require('./model/building.js')(sequelize);
db.levelOfDamage = require('./model/levelOfDamage.js')(sequelize);
db.requestForRepair = require('./model/requestForRepair.js')(sequelize)
db.receiveRepair = require('./model/receiveRepair.js')(sequelize)
db.repairDetail = require('./model/repairDetails.js')(sequelize)
db.assignWork = require('./model/assignWork.js')(sequelize)
// Define associations to Departments
db.admin.belongsTo(db.department, { foreignKey: {name:'departmentId',allowNull: false}, });
db.department.hasMany(db.admin, { foreignKey: {name:'departmentId',allowNull: false}})
db.employee.belongsTo(db.department, { foreignKey: {name:'departmentId',allowNull: false},  });
db.department.hasMany(db.employee, { foreignKey: {name:'departmentId',allowNull: false}})
db.technician.belongsTo(db.department, { foreignKey: {name:'departmentId',allowNull: false} });
db.department.hasMany(db.technician, { foreignKey: {name:'departmentId',allowNull: false}})
db.chief.belongsTo(db.department, {foreignKey:{name:'departmentId',allowNull: false},})
db.department.hasMany(db.chief, { foreignKey: {name:'departmentId',allowNull: false}})
// Define associations to technician status
db.technician.belongsTo(db.technicianStatus, { foreignKey: {name:'techStatusId',allowNull: false},  });
db.technicianStatus.hasMany(db.technician, { foreignKey: {name:'techStatusId',allowNull: false}});
// Define associations Notification
db.notification.belongsTo(db.technician, { foreignKey: 'tech_id',});
db.technician.hasMany(db.notification, { foreignKey: {name:'tech_id'},onDelete: 'CASCADE'})
db.notification.belongsTo(db.employee, { foreignKey: 'emp_id', });
db.employee.hasMany(db.notification, { foreignKey: {name:'emp_id'},onDelete: 'CASCADE'})
db.notification.belongsTo(db.admin, { foreignKey: 'admin_id', });
db.admin.hasMany(db.notification, { foreignKey: {name:'admin_id',},onDelete: 'CASCADE'})
// Define associations Equipment To EquipmentType
db.equipment.belongsTo(db.equipmentType,{foreignKey:{name:'eqc_id',allowNull: false},})
db.equipmentType.hasMany(db.equipment, { foreignKey: {name:'eqc_id',allowNull: false}})
// Define associations repair_request
db.requestForRepair.belongsTo(db.employee,{foreignKey:{name:'employee_id',allowNull: false},})
db.employee.hasMany(db.requestForRepair, { foreignKey: {name:'employee_id',allowNull: false}})
db.requestForRepair.belongsTo(db.building,{foreignKey:{name:'building_id',allowNull: false},})
db.building.hasMany(db.requestForRepair, { foreignKey: {name:'building_id',allowNull: false}})
db.requestForRepair.belongsTo(db.equipment,{foreignKey:{name:'eq_id',allowNull: false},})
db.equipment.hasMany(db.requestForRepair, { foreignKey: {name:'eq_id',allowNull: false}})
// Define associations AssignWork

// Admin มีหลาย AssignWork
db.assignWork.belongsTo(db.admin, { foreignKey: {name:'admin_id',allowNull: false} });
db.admin.hasMany(db.assignWork, { foreignKey: {name:'admin_id',allowNull: false}})
// Technician มีหลาย AssignWork
db.assignWork.belongsTo(db.technician, { foreignKey: {name:'tech_id',allowNull: false} });
db.technician.hasMany(db.assignWork, { foreignKey: {name:'tech_id',allowNull: false}})
// RequestForRepair มีหนึ่ง AssignWork
db.assignWork.belongsTo(db.requestForRepair, { foreignKey: {name:'rrid',allowNull: false} });
db.requestForRepair.hasOne(db.assignWork, { foreignKey: {name:'rrid',allowNull: false}})

// Define associations receive_repair
db.receiveRepair.belongsTo(db.requestForRepair, { foreignKey: {name:'rrid',allowNull: false} })
db.requestForRepair.hasOne(db.receiveRepair, { foreignKey: {name:'rrid',allowNull: false},onDelete: 'CASCADE'})
db.receiveRepair.belongsTo(db.technician, { foreignKey: {name:'tech_id',allowNull: false} })
db.technician.hasMany(db.receiveRepair, { foreignKey: {name:'tech_id',allowNull: false}})

// Define associations repari_detail
db.repairDetail.belongsTo(db.receiveRepair,{ foreignKey: {name:'rrce_id',allowNull: false}})
db.receiveRepair.hasMany(db.repairDetail,{ foreignKey: {name:'rrce_id',allowNull: false},onDelete: 'CASCADE'})
db.repairDetail.belongsTo(db.levelOfDamage,{ foreignKey: {name:'loed_id',allowNull: false}})
db.levelOfDamage.hasMany(db.repairDetail,{ foreignKey: {name:'loed_id',allowNull: false},onDelete: 'CASCADE'})

module.exports = db;
