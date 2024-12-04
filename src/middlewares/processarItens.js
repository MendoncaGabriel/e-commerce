const db = require('../../database/database');

function resgatarItens(req){
    const cookies = req.cookies.carrinho;
    const carrinhoJson = JSON.parse(cookies);
    return carrinhoJson;
}

async function verificarItens(data){
    const promessas = []
    data.forEach(element => {

        const item = new Promise((resolve, reject) =>{
            let sql = ""; 
            let values = [];
            
            if (typeof element.variante_id !== "undefined" && element.variante_id) {
                // É uma variante
                sql = "SELECT * FROM variantes WHERE variante_id = ?";
                values = [element.variante_id];
            } else {
                // É um produto
                sql = "SELECT * FROM produtos WHERE produto_id = ?";
                values = [element.produto_id];
            }


            db.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.length === 0) {
                        reject(new Error('Item não encontrado no banco de dados'));
                        return;
                    }
        
                    const qtd = Number(element.qtd);
                    const preco = Number(result[0].preco);
                    const total = qtd * preco;
                    
                    result[0].qtd = qtd;
                    result[0].total = total;
        
                    resolve(result[0]);
                }
            });
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
    const precoTotal = verificarTotal(itensVerificados);
    const data = {
        carrinho: carrinho,
        itensVerificados: itensVerificados,
        precoTotal: precoTotal
    } 

    if(!data || data.length == 0 || data == []) res.status(500).json({msg: "Falha ao verificar carrinho"}) 
    
    req.locals = data;
    next()
}

module.exports = processarItens;