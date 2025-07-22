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
    await queryInterface.bulkInsert ('Files', [
      {
        filename: 'firmware_v1.0.bin',
        path: 'uploads/firmware_v1.0.bin',
        downloadedBy: 2, // user1
        createdAt: new Date (),
        updatedAt: new Date (),
      },
      {
        filename: 'app_installer.exe',
        path: 'uploads/app_installer.exe',
        downloadedBy: 3, // user2
        createdAt: new Date (),
        updatedAt: new Date (),
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
    await queryInterface.bulkDelete ('Files', null, {});
  },
};
