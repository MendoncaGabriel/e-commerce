const executeSql = require('../utilities/executarSql')
const fs = require('fs');
const path = require('path');
const db = require('../../database/database');

module.exports = {
    processCheckout: async (carrinho) => {
        if(!carrinho || carrinho.length == 0 ) throw new Error('Cairrinho esta vazio');
        //array de promessas
        const promessas = [];
        
        //interando sobre array do cookie e buscando itens na base de dados
        carrinho.forEach(element => {
            const item = new Promise(async (resolve, reject) => {
                try {
                    const sql = `SELECT produtos.*, variantes.* FROM variantes JOIN produtos ON produtos.produto_id = variantes.produto_id WHERE variantes.variante_id = ?;`;
                    const values = [element.variante_id];
                    const result = await  executeSql(sql, values)
                    if(!result || result == []) throw new Error('1 Item não encontado no baco de dados');


                    //informando qtd e total selecionada pelo usuario
                    result[0].qtd = Number(element?.qtd);
                    result[0].total = Number(element?.qtd) * Number(result[0].preco);
                  
                    resolve(result[0])
                } catch (error) {
                    console.log(error)
                    reject(error.message)
                }
            });

            //adicionado promessa ao array
            promessas.push(item);
        });

        //resolvendo todas as promessas
        const result = await Promise.all(promessas);
        if(!result) throw new Error('Erro ao obter produtos do carrinho');

        //calcular total
        let total = 0;
        result.forEach(e => total += e.total);



        return {itens: result, total: total};

    },
}