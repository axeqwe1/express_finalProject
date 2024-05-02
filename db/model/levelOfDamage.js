const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const levelOfDamage = sequelize.define(
        "levelOfDamages",
        {
          loed_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          loed_Name: {
            type: DataTypes.STRING(50),
            allowNull: false,
          },
        },
        {
          tableName:'levelOfDamages',
          timestamps: false,
          createdAt: false,
          updatedAt: false,
        },
      );
    
    return levelOfDamage;
  }
  