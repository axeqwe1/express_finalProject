const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const building = sequelize.define(
        "buildings",
        {
          building_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          building_room_number: {
            type: DataTypes.STRING(10),
            allowNull: false,
          },
          building_floor: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          building_name:{
            type: DataTypes.STRING(10),
            allowNull: false,
          }
        },
        {
          tableName:'buildings',
          timestamps: false,
          createdAt: false,
          updatedAt: false,
        },
      );
    
    return building;
  }