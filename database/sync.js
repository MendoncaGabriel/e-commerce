const sequelize = require('../database/database');


// SCHEMAS
const Loja = require('../database/schemas/loja.schema');
const Pedido = require('../database/schemas/pedido.schema');
const Banner = require('../database/schemas/banner.schema');
const Usuario = require('../database/schemas/usuario.schema');
const Produto = require('../database/schemas/produto.schema');
const RedesSociais = require('../database/schemas/redesSociais.schema');
const EnderecoLoja = require('../database/schemas/endereco.loja.schema');
const MetodoEntrega = require('../database/schemas/metodo.entrega.schema');
const VarianteProduto = require('../database/schemas/variante.produto.schema');
const CategoriaProduto = require('../database/schemas/categoria.produto.shchema');


sequelize.sync({ force: false })
.then(() => {
  console.log('Tabelas sincronizadas com sucesso.');
  process.exit(0); // Encerra o script com sucesso
})
.catch(error => {
  console.error('Erro ao sincronizar tabelas:', error);
  process.exit(1); // Encerra o script com erro
});