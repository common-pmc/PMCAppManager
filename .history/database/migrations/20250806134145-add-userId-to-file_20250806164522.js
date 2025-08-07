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
    await queryInterface.addColumn ('Files', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Позволява null, ако не е зададен собственик
      references: {
        model: 'Users', // Името на таблицата с потребителите
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // Ако потребителят бъде изтрит, полето userId ще стане null
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
