'use strict';
const {Model} = require ('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Department.belongsTo (models.Company, {foreignKey: 'companyId'});
      Department.belongsTo (models.User, {foreignKey: 'userId'});
      Department.hasMany (models.User, {foreignKey: 'departmentId'});
      Department.hasMany (models.File, {
        foreignKey: 'departmentId',
        as: 'Files',
      });
    }
  }
  Department.init (
    {
      departmentName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Department',
    }
  );
  return Department;
};
