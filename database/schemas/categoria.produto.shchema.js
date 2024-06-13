const { DataTypes } = require('sequelize');
const db = require('../database');
const Loja = require('../schemas/loja.schema');

const CategoriaProduto = db.define('CategoriaProduto', {
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
  tableName: 'categorias_produto',
  timestamps: false,
});

Loja.hasMany(CategoriaProduto);
CategoriaProduto.belongsTo(Loja);

module.exports = CategoriaProduto;
