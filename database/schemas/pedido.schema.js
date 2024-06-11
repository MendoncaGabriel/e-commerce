// models/pedido.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pedido = sequelize.define('Pedido', {
  pedido_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status_pedido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_pedido: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  variante_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qtd: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2), // Exemplo para valores monetários
    allowNull: false,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2), // Exemplo para valores monetários
    allowNull: false,
  },
}, {
  tableName: 'pedidos', // Nome da tabela no banco de dados
  timestamps: false, // Se não quiser timestamps automáticos (created_at, updated_at)
});

module.exports = Pedido;
