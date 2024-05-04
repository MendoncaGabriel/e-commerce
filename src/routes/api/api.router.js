const express = require('express');
const router = express.Router();
const produtoController = require('../../controllers/api/produto.controller');
const pagamentoController = require('../../controllers/api/pagamento.controller');
const usuarioController = require('../../controllers/api/usuario.controller');

// MIDDLEWARE
const  upload = require('../../middlewares/multer');
const compactarImagem = require('../../middlewares/sharp');


//CRIAR
router.post('/produto', upload.array('imagens'), compactarImagem,  produtoController.novoProduto);
router.post('/variante', produtoController.novaVariante);

//LER
router.get('/produto/:id', produtoController.pegarProdutoId);
router.get('/variante/:id', produtoController.pegarVarianteId);
router.get('/produto/lista/:pg', produtoController.listaProdutos);

//ATUALIZAR
router.patch('/produto/:id', upload.array('imagens'), compactarImagem, produtoController.atualizarProduto);

//DELETAR
router.delete('/variante/:id', produtoController.removerVariante);
router.delete('/produto/:id', produtoController.removerProduto);

//PAGAMENTO
router.post('/pagamento/qrcodepix', pagamentoController.gerarQrCodePix);


//USUARIOS
router.post('/usuario/novo', usuarioController.novoUsuario );
router.patch('/usuario/endereco', usuarioController.endereco );

//PEDIDOS
router.post('/usuario/pedido', usuarioController.pedido);



module.exports = router;