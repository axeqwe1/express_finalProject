const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const technicianStatus = sequelize.define(
      'technicianStatus',
      {
          status_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
          receive_request_status: { type: DataTypes.CHAR(2), allowNull: false, field: 'receive_request_status' },

      },
      {
          tableName: 'technician_status',
          timestamps: false,
          createdAt: false,
          updatedAt: false,
      }
    );

    return technicianStatus;
  }
  