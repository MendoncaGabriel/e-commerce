const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Loja = require('./loja.schema');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pagina: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pc: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  mobile: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  loja_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lojas', // Nome da tabela no banco de dados
      key: 'id',     // Chave primária da tabela 'Loja'
    },
  },
}, {
  tableName: 'banners',
  timestamps: false,
});

// Relacionamentos
Banner.belongsTo(Loja, { foreignKey: 'loja_id', as: 'loja' });
Loja.hasMany(Banner, { foreignKey: 'loja_id', as: 'banners' });

module.exports = Banner;