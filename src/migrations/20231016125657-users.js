'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
              },
              fullName: {
                allowNull: false,
                type: Sequelize.STRING
              },
              phoneNumber: {
                allowNull: false,
                type: Sequelize.STRING
              },
              email: {
                allowNull: false,
                type: Sequelize.STRING
              },
              password: {
                allowNull: false,
                type: Sequelize.STRING
              },
              userName: {
                allowNull: false,
                type: Sequelize.STRING
              },
              isVerified: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false,
              },
              token: {
                type: Sequelize.STRING
              },
              verifyCode: {
                allowNull: true,
                type: Sequelize.INTEGER
              },
              image: {
                allowNull: true,
                type: Sequelize.STRING
              },
              createdAt: {
                allowNull: false,
                type: Sequelize.DATE
              },
              updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
              }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
