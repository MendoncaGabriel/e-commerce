const db = require('../../database/database');

class Pedido {
    constructor(usuario_id, produto_id, variante_id, qtd, preco, tipo, status){
        this.usuario_id = usuario_id;
        this.produto_id = produto_id;
        this.variante_id = variante_id || null;
        this.qtd = qtd;
        this.preco = preco;
        this.total = Number(this.preco) * Number(this.qtd);
        this.status = status;
        this.date = new Date();
        this.tipo = tipo;
    }


    async createPedido(){
        return new Promise((resolve, reject) => {
            (async ()=> {
                const sql = "INSERT INTO pedidos (status_pedido, data_pedido, usuario_id, tipo, produto_id, variante_id, qtd, total, preco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const values = [this.status, this.date, this.usuario_id, this.tipo, this.produto_id, this.variante_id, this.qtd, this.total, this.preco];

                db.query(sql, values, (error, result) => {
                    if(error){
                        console.log(error)
                        return  reject(error)
                    }else{
                        resolve(result)
                    }
                })

            })();
        })
    }
}

module.exports = Pedido;