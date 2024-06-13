const { DataTypes } = require('sequelize');
const db = require('../database');
const Loja = require('../schemas/loja.schema');

const EnderecoLoja = db.define('EnderecoLoja', {
  id: {
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
  whatsapp: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'enderecos_loja',
  timestamps: false,
});

Loja.hasMany(EnderecoLoja);
EnderecoLoja.belongsTo(Loja);

module.exports = EnderecoLoja;
