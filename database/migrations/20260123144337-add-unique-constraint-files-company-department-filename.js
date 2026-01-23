'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 1. UNIQUE за файлове С отдел
    await queryInterface.addIndex(
      'Files',
      ['companyId', 'departmentId', 'filename'],
      {
        unique: true,
        name: 'uniq_files_company_department_filename',
        where: {
          'departmentId': { [Sequelize.Op.ne]: null }
        }
      }
    );

    // 2. UNIQUE за файлове БЕЗ отдел
    await queryInterface.addIndex(
      'Files',
      ['companyId', 'filename'],
      {
        unique: true,
        name: 'uniq_files_company_filename_no_department',
        where: {
          'departmentId': null
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex('Files', 'uniq_files_company_department_filename');
    await queryInterface.removeIndex('Files', 'uniq_files_company_filename_no_department');
  }
};
