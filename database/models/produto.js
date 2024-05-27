const Sequelize =  require('sequelize');
const db = require('../database');

const Produto = db.define('produtos', {
    produto_id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false, 
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(100),
    },
    descricao: {
        type: Sequelize.TEXT
    },
    ativo: {
        type: Sequelize.TINYINT,
        defaultValue: 1
    },
    estoque: {
        type: Sequelize.INTEGER,
        defaultValue: 0
        
    },
    categoria: Sequelize.STRING(45),
    marca: Sequelize.STRING(45),
    modelo: Sequelize.STRING(45),
    preco: Sequelize.DECIMAL(10,2),
    tamanho: Sequelize.STRING(45),
    quantidade: Sequelize.STRING(45),
    referencia: Sequelize.STRING(45),
    vendas: Sequelize.INTEGER,
    ean: Sequelize.CHAR(13),
    referencia: Sequelize.STRING(45),
    custo: Sequelize.DECIMAL(10,2),
    imagem: Sequelize.STRING(255)
})

module.exports = Produto