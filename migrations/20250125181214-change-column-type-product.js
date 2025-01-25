'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'image_url', {
      type: Sequelize.TEXT,
      allowNull: true, // Change to false if the column should not allow nulls
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Products', 'image_url', {
      type: Sequelize.STRING, // VARCHAR in Sequelize
      allowNull: true, // Adjust this based on your original column definition
    });
  },
};
