const { DataTypes } = require('sequelize');
const db = require('../database');

const Loja = require('../schemas/loja.schema'); 
const Categoria = require('../schemas/categoria.produto.shchema')

const Produto = db.define('Produto', {
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
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  carrosel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tamanho: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  referencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vendas: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  ean: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  custo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'produtos',
  timestamps: false,
});

Loja.hasMany(Produto);
Produto.belongsTo(Loja);

Produto.belongsTo(Categoria)


module.exports = Produto;
