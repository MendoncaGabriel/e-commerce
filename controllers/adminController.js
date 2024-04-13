module.exports = {
    paginaCadastro: (req, res) => {
        res.render('admin/layout')
    },
    cadastroProduto: (req, res) => {
        res.render('admin/layout', {conteudo: './conteudo/cadastroProduto'})
    }
}