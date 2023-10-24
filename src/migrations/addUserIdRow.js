'user strict';

module.exports = {
    async up (queryInterface, Sequelize)  {
        await queryInterface.addColumn('Users', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
        })
    
},
async down(queryInterface, Sequelize) {
    await queryInterface.d('Users');
  }}
