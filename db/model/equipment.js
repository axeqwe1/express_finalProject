const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const equipment = sequelize.define(
        "equipments",
        {
          eq_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          eq_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
          },
          eq_status:{
            type:DataTypes.STRING(20),
            allowNull: false,
          },
          eq_unit:{
            type:DataTypes.STRING(20),
            allowNull: false,
          },
          eq_start_date:{
            type:DataTypes.DATE,
            allowNull:false,
          }
        },
        {
            tableName:'equipments',
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        },
      );
    
    return equipment;
  }
  