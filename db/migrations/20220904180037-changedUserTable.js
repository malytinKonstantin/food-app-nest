'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    await queryInterface.addColumn(
      'users',
      'phoneNumber',
      {
        type: Sequelize.DataTypes.STRING,
      },
      { transaction }
    );
    await queryInterface.removeColumn('users', 'phone', { transaction });
    await transaction.commit();
  },
  async down(queryInterface, Sequelize) {},
};
