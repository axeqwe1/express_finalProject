const { DataTypes,literal  } = require('sequelize');

module.exports = (sequelize) => {
  const requestForRepair = sequelize.define('request_for_repair', {
    rrid: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
    rr_description: { type: DataTypes.TEXT, allowNull: false },
    rr_picture: { type: DataTypes.TEXT, allowNull: false },
    request_status:{type: DataTypes.STRING(20),allowNull:false},
    timestamp: {type:DataTypes.DATE,allowNull:false,defaultValue: literal('CURRENT_TIMESTAMP')},
    employee_id: {type: DataTypes.INTEGER,allowNull: false},
    building_id: {type: DataTypes.INTEGER,allowNull: false},
    eq_id: {type: DataTypes.INTEGER,allowNull: false}
  },{
    tableName: 'request_for_repair',
    createdAt:false,
    updatedAt:false
  });

  return requestForRepair;
};