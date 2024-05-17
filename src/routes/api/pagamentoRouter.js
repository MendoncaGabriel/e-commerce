const express = require('express');
const router = express.Router();
const db = require('../../../database/database');
const pagamentoController = require('../../controllers/pagamentoController');


function resgatarItens(req){
    const cookies = req.cookies.carrinho;
    const carrinhoJson = JSON.parse(cookies);
    return carrinhoJson;
}

async function verificarItens(data){
    const promessas = []
    data.forEach(element => {

        const item = new Promise((resolve, reject) =>{
            const sql = "SELECT * FROM variantes WHERE variante_id = ?";
            const values = [element.variante_id];

            db.query(sql, values, (error, dataDb)=>{
                if(error){
                    reject(error)
                }else{
                    const qtd = Number(element.qtd);
                    const preco = Number(dataDb[0].preco);
                    const total = qtd * preco;
                    dataDb[0].qtd = qtd;
                    dataDb[0].total = total;
                    resolve(dataDb[0])
                }
            })
        })
        promessas.push(item)
    });
    return Promise.all(promessas)
}

function verificarTotal(data){
    let total = 0;
    data.forEach(e => {
        total += e.total;
    })
    return total;
}

const processarItens = async (req, res, next) => {
    const carrinho = await resgatarItens(req);
    const itensVerificados = await verificarItens(carrinho);
    const precoTotal = await verificarTotal(itensVerificados);
    const data = {
        carrinho: carrinho,
        itensVerificados: itensVerificados,
        precoTotal: precoTotal
    } 

    if(!data || data.length == 0 || data == []) res.status(500).json({msg: "Falha ao verificar carrinho"}) 
    
    req.locals = data;
    next()
}

//PAGAMENTO
router.post('/mercadoPago', processarItens, pagamentoController.mercadoPagoPix);



module.exports = router;