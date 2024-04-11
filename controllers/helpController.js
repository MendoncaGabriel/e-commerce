module.exports = {
    rotas: (req, res) => {
        res.status(200).json({
            rotas: [
                {
                    rota: "Inserir novo produto",
                    endpoint: '/produto/novo',
                    metodo: 'post',
                    esperado_body: {
                        nome_produto: "", 
                        descricao_produto: "", 
                        status_produto: true, 
                        modelo_produto: "", 
                        marca: "", 
                        categoria: ""
                    }
                },
                {
                    rota: "Inserir nova variante",
                    endpoint: '/produto/nova-variante',
                    metodo: 'post',
                    esperado_body: {
                        produto_id: 0, 
                        preco: "", 
                        tamanho: "", 
                        quantidade: "", 
                        referencia: "", 
                        vendas: 0, 
                        ean: "13 numeros", 
                        estoque: 0, 
                        custo: "", 
                        imagem: "/caminho/da/imagem.png"
                    
                    }
                },
                {
                    rota: "Inserir nova categoria",
                    endpoint: '/produto/nova-categoria',
                    metodo: 'post',
                    esperado_body: {
                        nome_categoria: ""
                    }
                },
                {
                    rota: "Pegar produto por id",
                    endpoint: '/produto/:id',
                    metodo: 'get',
                    esperado_body: {}
                },
                {
                    rota: "Pegar Lista de produto com offset",
                    endpoint: '/api/produto/lista/1?limit=1',
                    metodo: 'get',
                    esperado_body: {},
                    observacao: 'limit default e 20'
                },
                {
                    rota: "Atualizar produto",
                    endpoint: '/api/produto/:id',
                    metodo: 'patch',
                    esperado_body: {
                        nome_produto: "", 
                        descricao_produto: "", 
                        status_produto: true, 
                        modelo_produto: "", 
                        marca: "", 
                        categoria: ""
                    }, 
                    observacao: 'Necessario por no body apenas campos a serem atualizados'
                },
                {
                    rota: "Remover produto",
                    endpoint: '/api/produto/:id',
                    metodo: 'delete',
                    esperado_body: {}, 
                    observacao: ''
                },
            ]
        })
    }
}