const { DataTypes } = require("sequelize");

module.exports = ( sequelize ) => {
    const profile = sequelize.define(
        "profiles",
        {
            fullName: {type:DataTypes.STRING},
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        },
      );
    
    return profile;
  }
  