const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const admin = sequelize.define(
      'admin',
      {
          admin_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          firstname: { type: DataTypes.STRING(50), allowNull: false, field: 'firstname' },
          lastname: {type:DataTypes.STRING(50),allowNull:false,field:'lastname'},
          phone: {type:DataTypes.STRING(10),allowNull:false,field:"phone"},
          email: { type: DataTypes.STRING(50), allowNull: false, field: 'email' },
          password:{type: DataTypes.STRING(50),allowNull:false,field:'password'},
          departmentId: { type: DataTypes.INTEGER, allowNull: false, field: 'departmentId' } // FK for Department ID

      },
      {
          tableName: 'admins',
          timestamps: false,
          createdAt: false,
          updatedAt: false,
      }
    );
    return admin;
  }
  