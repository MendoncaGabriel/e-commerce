// models/metodo_entrega.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const MetodoEntrega = sequelize.define('MetodoEntrega', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxa: {
    type: DataTypes.DECIMAL(10, 2), // Exemplo para armazenar valores monetários
    allowNull: false,
    defaultValue: 0.00, // Valor padrão para a taxa
  },
}, {
  tableName: 'metodos_entrega',
  timestamps: false, 
});

module.exports = MetodoEntrega;
