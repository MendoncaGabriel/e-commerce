const sequelize = require('../database/database');


// SCHEMAS
const Banner = require('../database/schemas/banner.schema');
const Carrossel = require('../database/schemas/carrossel.schema');
const CategoriaProduto = require('../database/schemas/categoria.produto.shchema');
const EnderecoLoja = require('../database/schemas/endereco.loja.schema');
const Loja = require('../database/schemas/loja.schema');
const MetodoEntrega = require('../database/schemas/metodo.entrega.schema');
const Pedido = require('../database/schemas/pedido.schema');
const Produto = require('../database/schemas/produto.schema');
const RedesSociais = require('../database/schemas/redesSociais.schema');
const Usuario = require('../database/schemas/usuario.schema');
const VarianteProduto = require('../database/schemas/variante.produto.schema');


sequelize.sync({ force: true })
.then(() => {
  console.log('Tabelas sincronizadas com sucesso.');
  process.exit(0); // Encerra o script com sucesso
})
.catch(error => {
  console.error('Erro ao sincronizar tabelas:', error);
  process.exit(1); // Encerra o script com erro
});