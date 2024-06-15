const { DataTypes } = require('sequelize');
const db = require('../database');
const Produto = require('./produto.schema');

const Variante = db.define('VarianteProduto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tamanho: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  quantidade: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  referencia: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  vendas: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ean: {
    type: DataTypes.CHAR(13),
    allowNull: true,
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  custo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  imagem: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  nome: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  cor: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
}, {
  tableName: 'variantes',
  timestamps: false,
});

Produto.hasMany(Variante);
Variante.belongsTo(Produto);

module.exports = Variante;