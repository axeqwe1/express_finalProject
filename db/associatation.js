const sequelize = require('./config/sequelizeConfig.js')
const model = {};
// กำหนด properties sequelize ของ db เก็บ object sequelize ด้านบน
model.sequelize = sequelize;

//ส่วนนี้เป็นการ import model ของ table ใน database เข้ามาเพื่อตั้งต่า relation
model.admin = require("./model/admin")(sequelize);
model.department = require("./model/department")(sequelize);
model.employee = require("./model/employee")(sequelize);
model.technician = require("./model/technician")(sequelize);
model.chief = require("./model/chief")(sequelize);
model.technicianStatus = require("./model/technician_status")(sequelize);
model.notification = require("./model/notification")(sequelize);
model.equipment = require('./model/equipment.js')(sequelize);
model.equipmentType = require('./model/equipment_type.js')(sequelize);
model.building = require('./model/building.js')(sequelize);
model.levelOfDamage = require('./model/levelOfDamage.js')(sequelize);
model.requestForRepair = require('./model/requestForRepair.js')(sequelize)
model.receiveRepair = require('./model/receiveRepair.js')(sequelize)
model.repairDetail = require('./model/repairDetails.js')(sequelize)
model.assignWork = require('./model/assignWork.js')(sequelize)
// Define associations to Departments
model.admin.belongsTo(model.department, { foreignKey: {name:'departmentId',allowNull: false}, });
model.department.hasMany(model.admin, { foreignKey: {name:'departmentId',allowNull: false}})
model.employee.belongsTo(model.department, { foreignKey: {name:'departmentId',allowNull: false},  });
model.department.hasMany(model.employee, { foreignKey: {name:'departmentId',allowNull: false}})
model.technician.belongsTo(model.department, { foreignKey: {name:'departmentId',allowNull: false} });
model.department.hasMany(model.technician, { foreignKey: {name:'departmentId',allowNull: false}})
model.chief.belongsTo(model.department, {foreignKey:{name:'departmentId',allowNull: false},})
model.department.hasMany(model.chief, { foreignKey: {name:'departmentId',allowNull: false}})
// Define associations to technician status
model.technician.belongsTo(model.technicianStatus, { foreignKey: {name:'status_id',allowNull: false},  });
model.technicianStatus.hasMany(model.technician, { foreignKey: {name:'status_id',allowNull: false}});
// Define associations Notification
model.notification.belongsTo(model.technician, { foreignKey: 'tech_id',});
model.technician.hasMany(model.notification, { foreignKey: {name:'tech_id'},onDelete: 'CASCADE'})
model.notification.belongsTo(model.employee, { foreignKey: 'emp_id', });
model.employee.hasMany(model.notification, { foreignKey: {name:'emp_id'},onDelete: 'CASCADE'})
model.notification.belongsTo(model.admin, { foreignKey: 'admin_id', });
model.admin.hasMany(model.notification, { foreignKey: {name:'admin_id',},onDelete: 'CASCADE'})
// Define associations Equipment To EquipmentType
model.equipment.belongsTo(model.equipmentType,{foreignKey:{name:'eqc_id',allowNull: false},})
model.equipmentType.hasMany(model.equipment, { foreignKey: {name:'eqc_id',allowNull: false}})
// Define associations repair_request
model.requestForRepair.belongsTo(model.employee,{foreignKey:{name:'employee_id',allowNull: false},})
model.employee.hasMany(model.requestForRepair, { foreignKey: {name:'employee_id',allowNull: false}})
model.requestForRepair.belongsTo(model.building,{foreignKey:{name:'building_id',allowNull: false},})
model.building.hasMany(model.requestForRepair, { foreignKey: {name:'building_id',allowNull: false}})
model.requestForRepair.belongsTo(model.equipment,{foreignKey:{name:'eq_id',allowNull: false},})
model.equipment.hasMany(model.requestForRepair, { foreignKey: {name:'eq_id',allowNull: false}})
// Define associations AssignWork

// Admin มีหลาย AssignWork
model.assignWork.belongsTo(model.admin, { foreignKey: {name:'admin_id',allowNull: false} });
model.admin.hasMany(model.assignWork, { foreignKey: {name:'admin_id',allowNull: false}})
// Technician มีหลาย AssignWork
model.assignWork.belongsTo(model.technician, { foreignKey: {name:'tech_id',allowNull: false} });
model.technician.hasMany(model.assignWork, { foreignKey: {name:'tech_id',allowNull: false}})
// RequestForRepair มีหนึ่ง AssignWork
model.assignWork.belongsTo(model.requestForRepair, { foreignKey: {name:'rrid',allowNull: false} });
model.requestForRepair.hasOne(model.assignWork, { foreignKey: {name:'rrid',allowNull: false}})

// Define associations receive_repair
model.receiveRepair.belongsTo(model.requestForRepair, { foreignKey: {name:'rrid',allowNull: false} })
model.requestForRepair.hasOne(model.receiveRepair, { foreignKey: {name:'rrid',allowNull: false},onDelete: 'CASCADE'})
model.receiveRepair.belongsTo(model.technician, { foreignKey: {name:'tech_id',allowNull: false} })
model.technician.hasMany(model.receiveRepair, { foreignKey: {name:'tech_id',allowNull: false}})

// Define associations repari_detail
model.repairDetail.belongsTo(model.receiveRepair,{ foreignKey: {name:'rrce_id',allowNull: false}})
model.receiveRepair.hasMany(model.repairDetail,{ foreignKey: {name:'rrce_id',allowNull: false},onDelete: 'CASCADE'})
model.repairDetail.belongsTo(model.levelOfDamage,{ foreignKey: {name:'loed_id',allowNull: false}})
model.levelOfDamage.hasMany(model.repairDetail,{ foreignKey: {name:'loed_id',allowNull: false},onDelete: 'CASCADE'})

module.exports = model;
