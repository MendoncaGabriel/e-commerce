const { DataTypes } = require('sequelize');
const db = require('../database');

const Loja = require('../schemas/loja.schema');
const Produto = require('../schemas/produto.schema');
const Variante = require('../schemas/variante.produto.schema');
const Usuario = require('../schemas/usuario.schema');

const Pedido = db.define('Pedido', {
  id: {
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
  qtd: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
  }
}, {
  tableName: 'pedidos', 
  timestamps: false,
});

Loja.hasMany(Pedido);
Pedido.belongsTo(Loja);

Produto.hasMany(Pedido);
Pedido.belongsTo(Produto);

Variante.hasMany(Pedido);
Pedido.belongsTo(Variante);

Usuario.hasMany(Pedido);
Pedido.belongsTo(Usuario);

module.exports = Pedido;
