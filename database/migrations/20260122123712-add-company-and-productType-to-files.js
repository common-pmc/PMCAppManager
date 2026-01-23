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
    await queryInterface.addColumn('Files', 'productType', {
      type: Sequelize.ENUM('software', 'firmware', 'documentation'),
      allowNull: false,
      defaultValue: 'software'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Files', 'productType');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Files_productType";'
    );
  }
};
