module.exports = {
    paginaCadastro: (req, res) => {
        res.render('admin/layout')
    },
    cadastroProduto: (req, res) => {
        res.render('admin/layout', {conteudo: './conteudo/cadastroProduto', titulo: 'Cadastro de Produto'})
    },
    edicaoProduto: (req, res) => {
        res.render('admin/layout', {conteudo: './conteudo/edicaoProduto', titulo: 'Edição de produto'})

    }
}