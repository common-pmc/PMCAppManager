'use strict';
const {Model} = require ('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      User.hasMany (models.DownloadHistory, {
        foreignKey: 'userId',
      });
      User.hasMany (models.DownloadLog, {
        foreignKey: 'userId',
      });
      User.hasMany (models.File, {
        foreignKey: 'downloadedBy',
      });
      User.belongsTo (models.Company, {
        foreignKey: 'companyId',
      });
      User.belongsTo (models.Department, {
        foreignKey: 'departmentId',
        allowNull: true,
        as: 'Department',
      });
    }
  }
  User.init (
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
