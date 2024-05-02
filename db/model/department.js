const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const department = sequelize.define(
        "departments",
        {
          department_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          departmentName: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        {
          tableName:'departments',
          timestamps: false,
          createdAt: false,
          updatedAt: false,
        },
      );
    
    return department;
  }
  