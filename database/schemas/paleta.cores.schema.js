const { DataTypes, HasMany } = require('sequelize');
const db = require('../database');
const Loja = require('./loja.schema');

const PaletaCores = db.define('paletaCores', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  c0: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  c1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  c2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  c3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  c4: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  c5: {
    type: DataTypes.STRING,
    allowNull: false,
  }

}, {
  tableName: 'paleta_cores',
  timestamps: false,
});



Loja.hasMany(PaletaCores);
PaletaCores.belongsTo(Loja);



module.exports = PaletaCores;