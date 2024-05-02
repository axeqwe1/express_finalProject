const { DataTypes,literal  } = require('sequelize');

module.exports = (sequelize) => {
  const assignWork = sequelize.define('assign_work', {
    as_id: {type: DataTypes.INTEGER,allowNull:false,primaryKey: true,autoIncrement: true,},
    admin_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false ,
        primaryKey: true,
        references:{
            model:"admins",
            key:"admin_id"
        }
    },
    tech_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false ,
        primaryKey: true,
        references:{
            model:"technicians",
            key:"tech_id"
        }
    },
    rrid: { 
        type: DataTypes.INTEGER, 
        allowNull: false ,
        primaryKey: true,
        unique: true,
        references:{
            model:"request_for_repair",
            key:"rrid"
        }
    },
    timestamp: {type:DataTypes.DATE,allowNull:false,defaultValue: literal('CURRENT_TIMESTAMP')}
  },{
    tableName: 'assign_work',
    createdAt:false,
    updatedAt:false,
    indexes:[
      {
        unique: true,
        fields: ['admin_id', 'tech_id', 'rrid']
      }
    ]
  });

  return assignWork;
};