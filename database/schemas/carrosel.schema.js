const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Loja = require('../schemas/loja.schema');

const CarroselProduto = sequelize.define('CarroselProduto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
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
  tableName: 'carroselProduto',
  timestamps: false,
});

CarroselProduto.belongsTo(Loja, { foreignKey: 'loja_id', as: 'loja' });
Loja.hasMany(CarroselProduto, { foreignKey: 'loja_id', as: 'carroselProduto' });

module.exports = CarroselProduto;