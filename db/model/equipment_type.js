const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const equipmentType = sequelize.define(
        "equipment_Types",
        {
          eqc_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          eqc_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
          },
        },
        {
            tableName:'equipment_Types',
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        },
      );
    
    return equipmentType;
  }
  