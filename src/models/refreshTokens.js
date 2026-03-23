'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },

  tokenHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  revokedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'RefreshTokens',
  timestamps: true,
});

module.exports = RefreshToken;
