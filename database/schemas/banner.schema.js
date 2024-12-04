const { DataTypes, HasMany } = require('sequelize');
const db = require('../database');
const Loja = require('./loja.schema');

const Banner = db.define('Banner', {
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
  }
}, {
  tableName: 'banners',
  timestamps: false,
});



Loja.hasMany(Banner);
Banner.belongsTo(Loja);



module.exports = Banner;