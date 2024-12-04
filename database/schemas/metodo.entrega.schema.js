const { DataTypes } = require('sequelize');
const db = require('../database');
const Loja = require('../schemas/loja.schema');

const MetodoEntrega = db.define('MetodoEntrega', {
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxa: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00, 
  },
}, {
  tableName: 'metodos_entrega',
  timestamps: false, 
});

Loja.hasMany(MetodoEntrega);
MetodoEntrega.belongsTo(Loja);

module.exports = MetodoEntrega;
