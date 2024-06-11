const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const RedeSocial = sequelize.define('RedeSocial', {
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
      isUrl: true, // Valida se é uma URL válida
    },
  },
}, {
  tableName: 'redes_sociais', // Nome da tabela no banco de dados
  timestamps: false, 
});

module.exports = RedeSocial;
