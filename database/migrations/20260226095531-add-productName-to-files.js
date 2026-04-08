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
    await queryInterface.addColumn('Files', 'productName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Индексиране за по-бързо търсене
    await queryInterface.addIndex('Files', [
      'companyId',
      'departmentId',
      'productName',
      'productType',
      'filename',
    ], {
      unique: true,
      name: 'files_unique_product_file'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex('Files', 'files_unique_product_file');
    await queryInterface.removeColumn('Files', 'productName');
  }
};
