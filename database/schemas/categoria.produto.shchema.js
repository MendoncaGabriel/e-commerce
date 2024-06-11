const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'categorias',
  timestamps: false,
});

module.exports = Categoria;