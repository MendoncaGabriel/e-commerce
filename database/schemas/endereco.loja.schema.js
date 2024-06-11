const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const EnderecoLoja = sequelize.define('EnderecoLoja', {
  endereco_empresa_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maps_iframe: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  link_maps: {
    type: DataTypes.STRING,
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
  tableName: 'enderecos',
  timestamps: false,
});

module.exports = EnderecoLoja;
