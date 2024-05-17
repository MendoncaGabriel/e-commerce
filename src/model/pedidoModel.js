module.exports = {
    registarPedido: async (pedido, tokenUsuario) => {
        const { id } = await Utilitarios.verificarToken(tokenUsuario);
        const sql = "INSERT INTO pedidos (status, qtdProduto, usuarios_idusuarios, produtos_produto_id, variantes_variante_id, data) VALUES (?, ?, ?, ?, ?, ?);"
     
        try {
            await Promise.all(pedido.map(async element => {
                let data = new Date()
                const values = ['Aguardando Pagamento', element.qtdProduto, id, element.produto_id, element.variante_id, data ];
                const result = await executarSql(sql, values);
            }));
        } catch (error) {
            console.error("Erro ao registrar pedido:", error);
        }
    }
}