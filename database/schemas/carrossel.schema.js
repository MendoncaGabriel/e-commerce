const { DataTypes } = require('sequelize');
const db = require('../database');
const Loja = require('./loja.schema');

const Carrossel = db.define('carrossel', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'carrosseis',
  timestamps: false,
});

Loja.hasMany(Carrossel);
Carrossel.belongsTo(Loja);

module.exports = Carrossel;