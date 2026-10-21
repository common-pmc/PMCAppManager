"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;
    const companyName = process.env.ADMIN_COMPANY_NAME?.trim();

    if (!email || !password || !companyName) {
      throw new Error(
        "ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_COMPANY_NAME are required.",
      );
    }

    if (password.length < 6) {
      throw new Error("ADMIN_PASSWORD must contain at least 6 characters.");
    }

    const existingAdmin = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE email = :email LIMIT 1",
      {
        replacements: { email },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    if (existingAdmin.length > 0) {
      console.log("User already exists. Skipping creation.");
      return;
    }

    const companies = await queryInterface.sequelize.query(
      "SELECT id FROM Companies WHERE companyName = :companyName LIMIT 1",
      {
        replacements: { companyName },
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    if (companies.length === 0) {
      throw new Error("Company not found. Run the company seeder first.");
    }

    const companyId = companies[0].id;
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    await queryInterface.bulkInsert("Users", [
      {
        email,
        password: hashedPassword,
        isAdmin: true,
        companyId,
        departmentId: null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    console.log("Administrator created successfully.");
  },

  async down(queryInterface) {
    const email = process.env.ADMIN_EMAIL?.trim();

    if (!email) {
      throw new Error("ADMIN_EMAIL is required for rollback.");
    }

    await queryInterface.bulkDelete("Users", { email }, {});
  },
};
