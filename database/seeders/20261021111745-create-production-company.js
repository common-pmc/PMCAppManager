"use strict";

require("dotenv").config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const companyName = process.env.ADMIN_COMPANY_NAME?.trim();

    if (!companyName) {
      throw new Error("ADMIN_COMPANY_NAME is required.");
    }

    const existing = await queryInterface.sequelize.query(
      "SELECT id FROM Companies WHERE companyName = :companyName LIMIT 1",
      {
        replacements: { companyName },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    if (existing.length > 0) {
      console.log("Company already exists. Skipping creation.");
      return;
    }

    await queryInterface.bulkInsert("Companies", [
      {
        companyName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    const companyName = process.env.ADMIN_COMPANY_NAME?.trim();

    if (!companyName) {
      throw new Error("ADMIN_COMPANY_NAME is required for rollback.");
    }

    await queryInterface.bulkDelete("Companies", { companyName }, {});
  },
};
