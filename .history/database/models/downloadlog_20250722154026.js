'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DownloadLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DownloadLog.init({
    userId: DataTypes.INTEGER,
    fileId: DataTypes.INTEGER,
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'DownloadLog',
  });
  return DownloadLog;
};