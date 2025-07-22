'use strict';
const {Model} = require ('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DownloadHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      DownloadHistory.belongsTo (models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  DownloadHistory.init (
    {
      userId: DataTypes.INTEGER,
      fileId: DataTypes.INTEGER,
      downloadedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'DownloadHistory',
    }
  );
  return DownloadHistory;
};
