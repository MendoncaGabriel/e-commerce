const db = require('../../database/database');

module.exports = {
    processCheckout: async (carrinho) => {
        if (!carrinho || carrinho.length === 0) {
            throw new Error('Carrinho está vazio');
        }
    
        const promessas = carrinho.map(element => {
            return new Promise((resolve, reject) => {
                (async ()=> {
                    try {
                        let sql = ''
                        let values = []
    
                        if(typeof element.variante_id != "undefined" && element.variante_id){
                            //e uma varianre
                            sql = "SELECT produtos.*, variantes.* FROM variantes JOIN produtos ON produtos.produto_id = variantes.produto_id WHERE variantes.variante_id = ?;";
                            values = [element.variante_id];
                        }else{
                            //e um produto
                            sql = "SELECT * FROM produtos WHERE produtos.produto_id = ?;"
                            values = [element.produto_id];
                        }
                        
                        const result = await new Promise((resolve, reject) => {
                            db.query(sql, values, (error, result) => {
                                if(error){
                                    return reject(error)
                                }else{
                                    return resolve(result)
                                }
                            })
                        })
    
                  
        
                        if (!result || result.length === 0) {
                            throw new Error('Item não encontrado no banco de dados');
                        }
        
                        const item = {
                            ...result[0], // Copia todas as propriedades de result[0]
                            qtd: Number(element.qtd),
                            total: Number(element.qtd) * Number(result[0].preco)
                        };
        
                        resolve(item);
                    } catch (error) {
                        console.error(error);
                        reject(error.message);
                    }
                })();
            });
        });
    
        try {
            const itens = await Promise.all(promessas);
    
            let total = 0;
            itens.forEach(item => {
                total += item.total;
            });
    
            return { itens, total };
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao obter produtos do carrinho');
        }
    }
}