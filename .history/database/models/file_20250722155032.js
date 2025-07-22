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
        foreignKey: 'downloadedBy',
        as: 'user',
      });
    }
  }
  File.init (
    {
      filename: DataTypes.STRING,
      path: DataTypes.STRING,
      downloadedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'File',
    }
  );
  return File;
};
