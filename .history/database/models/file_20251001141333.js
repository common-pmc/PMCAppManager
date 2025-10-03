'use strict';
const {Model} = require ('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      File.belongsTo (models.User, {
        foreignKey: 'userId',
        as: 'owner',
      });
      File.belongsTo (models.User, {
        foreignKey: 'downloadedBy',
        as: 'lastDownloader',
      });
      File.hasMany (models.DownloadHistory, {
        foreignKey: 'fileId',
      });
      File.hasMany (models.DownloadLog, {
        foreignKey: 'fileId',
      });
      File.belongsTo (models.Company, {
        foreignKey: 'companyId',
        as: 'Company',
      });
      File.belongsTo (models.Department, {
        foreignKey: 'departmentId',
        as: 'Department',
      });
    }
  }
  File.init (
    {
      filename: DataTypes.STRING,
      path: DataTypes.STRING,
      downloadedBy: DataTypes.INTEGER,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'File',
    }
  );
  return File;
};
