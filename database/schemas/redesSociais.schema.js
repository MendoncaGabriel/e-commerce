const { DataTypes } = require('sequelize');
const db = require('../database');

const Loja = require('../schemas/loja.schema');

const RedeSocial = db.define('RedeSocial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true, 
    },
  },
  perfil: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'redes_sociais', 
  timestamps: false, 
});

Loja.hasMany(RedeSocial);
RedeSocial.belongsTo(Loja);

module.exports = RedeSocial;
