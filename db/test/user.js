const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const user = sequelize.define(
        "USERS",
        {
          username: {type:DataTypes.STRING},
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        },
      );
    
    return user;
  }
  