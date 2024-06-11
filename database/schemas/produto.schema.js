const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Loja = require('../schemas/loja.schema'); // Verifique o caminho correto do arquivo Loja

const Produto = sequelize.define('Produto', {
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
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  loja_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lojas',
      key: 'id',
    },
  },
}, {
  tableName: 'produtos',
  timestamps: false,
});

// Configuração da associação
Produto.belongsTo(Loja, { foreignKey: 'loja_id', as: 'loja' }); // Um Produto pertence a uma Loja
Loja.hasMany(Produto, { foreignKey: 'loja_id', as: 'produtos' }); // Uma Loja tem muitos Produtos


module.exports = Produto;
