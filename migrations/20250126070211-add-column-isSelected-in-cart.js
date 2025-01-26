'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Add the 'isSelected' column to the 'carts' table
     */
    await queryInterface.addColumn('Carts', 'isSelected', {
      type: Sequelize.BOOLEAN,
      defaultValue: false, // Set default value as false
      allowNull: false,    // Ensure the column can't be null
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Remove the 'isSelected' column from the 'carts' table
     */
    await queryInterface.removeColumn('Carts', 'isSelected');
  }
};
