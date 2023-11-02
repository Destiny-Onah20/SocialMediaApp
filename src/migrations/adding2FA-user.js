'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the 'twoFA_enabled' column
    await queryInterface.addColumn('Users', 'twoFA_enabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Set the default value to false
      allowNull: false,
    });

    // Add the 'twoFA_secret' column
    await queryInterface.addColumn('Users', 'twoFA_secret', {
      type: Sequelize.STRING,
      defaultValue: null, // Set the default value to null
      allowNull: true,     // Allow null values for this column
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'twoFA_enabled' and 'twoFA_secret' columns
    await queryInterface.removeColumn('Users', 'twoFA_enabled');
    await queryInterface.removeColumn('Users', 'twoFA_secret');
  }
};
