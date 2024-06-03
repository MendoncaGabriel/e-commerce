const db = require('../../database/database');


module.exports = {

    getBySearchTerm: (termo) => {
        return new Promise((resolve, reject) => {
            const palavras = termo.split(' ');
    
            let whereClause = '';
            const values = [];
    
            palavras.forEach((palavra, index) => {
                if (index > 0) {
                    whereClause += ' OR ';
                }
                whereClause += `
                    LOWER(produtos.nome) LIKE CONCAT('%', LOWER(?), '%')
                `;
                values.push(palavra);
            });
    
            const sql = `
                SELECT produtos.*, variantes.*
                FROM produtos
                JOIN variantes ON produtos.produto_id = variantes.produto_id
                WHERE produtos.ativo = 1
                AND (${whereClause})
                AND variantes.imagem IS NOT NULL
                AND variantes.imagem <> ''
                AND variantes.estoque > 0
                ORDER BY CASE
                    WHEN LOWER(produtos.nome) LIKE CONCAT(LOWER(?), '%') THEN 1
                    ELSE 2
                END, produtos.nome
                LIMIT 10;
            `;
    
            // Adicionar cada palavra novamente para o ORDER BY
            palavras.forEach(palavra => {
                values.push(palavra);
            });
    
            db.query(sql, values, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}