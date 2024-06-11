const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Loja = sequelize.define('Loja', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'lojas',
  timestamps: false,
});

module.exports = Loja;