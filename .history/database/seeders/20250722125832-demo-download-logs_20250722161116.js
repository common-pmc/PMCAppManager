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
    await queryInterface.bulkInsert ('DownloadLogs', [
      {
        userId: 2,
        fileId: 1,
        ipAddress: '192.168.0.12',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
        timestamp: new Date (),
      },
      {
        userId: 3,
        fileId: 2,
        ipAddress: '192.168.0.13',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        timestamp: new Date (),
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
