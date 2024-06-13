const { DataTypes } = require('sequelize');
const db = require('../database');

const Loja = require('../schemas/loja.schema');
const Produto = require('../schemas/produto.schema');

const CategoriaProduto = db.define('categoriaProduto', {
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
  tableName: 'categoriasProduto',
  timestamps: false,
});

Loja.hasMany(CategoriaProduto);
CategoriaProduto.belongsTo(Loja);

Produto.belongsTo(CategoriaProduto)

module.exports = CategoriaProduto;