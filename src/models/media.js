'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  media_type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
  },

  file_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  is_favourite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  title: {
    type: DataTypes.STRING,
  },

  description: {
    type: DataTypes.TEXT,
  },

  file_size: {
    type: DataTypes.INTEGER,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'Media',
  timestamps: true,
});

// Associations
Media.associate = (models) => {
  Media.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

module.exports = Media;