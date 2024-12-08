const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const employee = sequelize.define(
      'employees',
      {
          emp_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          firstname: { type: DataTypes.STRING(50), allowNull: false, field: 'firstname' },
          lastname: {type:DataTypes.STRING(50),allowNull:false,field:'lastname'},
          phone: {type:DataTypes.STRING(10),allowNull:false,field:"phone"},
          email: { type: DataTypes.STRING(50), allowNull: false, field: 'email' },
          password:{type: DataTypes.STRING(50),allowNull:false,field:'password'},
          departmentId: { type: DataTypes.INTEGER, 
            allowNull: false, 
            field: 'department_id' 
        } // FK for Department ID

      },
      {
          tableName: 'employees',
          timestamps: false,
          createdAt: false,
          updatedAt: false,
      }
    );

    return employee;
  }
  