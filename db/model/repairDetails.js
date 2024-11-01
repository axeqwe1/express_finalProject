const { DataTypes,literal  } = require('sequelize');

module.exports = (sequelize) => {
  const repairDetail = sequelize.define('repair_details', {
    rd_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
    loed_id: { type: DataTypes.INTEGER, 
      allowNull: false ,
      primaryKey:true,
      references:{
          model:"levelOfDamages",
          key:"loed_id"
      }
    },
    rrce_id: {
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        references:{
            model:"receive_repair",
            key:"rrce_id"
        }
    },
    rd_description: { type: DataTypes.TEXT, allowNull: true },
    timestamp: {type:DataTypes.DATE,allowNull:false,defaultValue: literal('CURRENT_TIMESTAMP')}
  },{
    tableName:'repair_details',
    createdAt:false,
    updatedAt:false,
  });

  return repairDetail;
};