'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    queryInterface.bulkInsert ('Departments', [
      {
        departmentName: 'HR',
        companyId: 1,
        userId: null,
        createdAt: new Date (),
        updatedAt: new Date (),
      },
      {
        departmentName: 'Engineering',
        companyId: 1,
        userId: 2,
        createdAt: new Date (),
        updatedAt: new Date (),
      },
      {
        departmentName: 'Sales',
        companyId: 2,
        userId: null,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
