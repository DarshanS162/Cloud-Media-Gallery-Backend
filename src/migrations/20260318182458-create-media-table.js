'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Media', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id',
        },
        onDelete: 'CASCADE', 
      },

      media_type: {
        type: Sequelize.ENUM('image', 'video'),
        allowNull: false,
      },

      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      is_favourite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      title: {
        type: Sequelize.STRING,
      },

      description: {
        type: Sequelize.TEXT,
      },

      file_size: {
        type: Sequelize.INTEGER, // in bytes
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Media');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Media_media_type";');
  }
};