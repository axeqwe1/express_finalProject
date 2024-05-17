const { DataTypes,literal } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('notifications', {
    noti_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
    noti_message: { type: DataTypes.TEXT, allowNull: false },
    admin_id: { type: DataTypes.INTEGER, allowNull: true },
    emp_id: { type: DataTypes.INTEGER, allowNull: true },
    tech_id:{type: DataTypes.INTEGER, allowNull: true  },
    timestamp: {type:DataTypes.DATE,allowNull:false,defaultValue: literal('CURRENT_TIMESTAMP')},
  },{
    tableName: 'notifications',
    createdAt: false,
    updatedAt: false,
  });

  return Notification;
};