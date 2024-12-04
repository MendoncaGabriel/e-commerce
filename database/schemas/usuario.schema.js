const { DataTypes } = require('sequelize');
const db = require('../database');

const Loja = require('../schemas/loja.schema');

const Usuario = db.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rua: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Brasil', 
  },
  numero_casa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'usuarios',
  timestamps: false, 
});

Loja.hasMany(Usuario);
Usuario.belongsTo(Loja);

module.exports = Usuario;
