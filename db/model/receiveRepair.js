const { DataTypes,literal  } = require('sequelize');

module.exports = (sequelize) => {
  const receiveRepair = sequelize.define('receive_repair', {
    rrce_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
    tech_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false ,
      references:{
        model:"technicians",
        key:"tech_id"
      }
    },
    date_receive: {type:DataTypes.DATE,allowNull:false,defaultValue: literal('CURRENT_TIMESTAMP')},
    rrid: { 
      type: DataTypes.INTEGER, 
      allowNull: false ,
      unique: true,
      references:{
        model:"request_for_repair",
        key:"rrid"
      }
    },
  },{
    tableName: 'receive_repair',
    createdAt:false,
    updatedAt:false
  });

  return receiveRepair;
};