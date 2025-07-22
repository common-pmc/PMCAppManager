'use strict';
const bcrypt = require ('bcryptjs');

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
    const hash = await bcrypt.hash ('admin123', 10);
    await queryInterface.bulkInsert ('Users', [
      {
        email: 'admin@example.com',
        password: hash,
        isAdmin: true,
        company: 'PMC Ltd',
        createdAt: new Date (),
        updatedAt: new Date (),
      },
      {
        email: 'user1@firm-a.com',
        password: hash,
        isAdmin: false,
        company: 'Firm A',
        createdAt: new Date (),
        updatedAt: new Date (),
      },
      {
        email: 'user2@firm-b.com',
        password: hash,
        isAdmin: false,
        company: 'Firm B',
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
  },
};
