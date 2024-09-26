const inputCategoria = document.querySelector("#inputCategoria")
const btnCadastrar = document.querySelector("#btnCadastrar")

const Categoria = {
    aditar: (id, nome) => {
        inputCategoria.value = nome
        btnCadastrar.innerText = 'Atualizar'
        btnCadastrar.setAttribute('onclick', `Categoria.salvarEdicao(${id})`);
    },
    salvarEdicao: (id) => {
        const categoriaAtualizada = inputCategoria.value
        inputCategoria.value = ''
        btnCadastrar.innerText = 'Cadastrar'
        btnCadastrar.setAttribute('onclick', `Categoria.salvarEdicao(${id}, '${categoriaAtualizada}')`);

        fetch('/admin/categorias', {
            headers: {'Content-Type': 'application/json'},
            method: 'PATCH',
            body: JSON.stringify({
                id: id,
                nome: categoriaAtualizada
            })
        })
    }
}