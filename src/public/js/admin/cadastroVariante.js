const cadastroVariante = document.getElementById('cadastroVariante');

cadastroVariante.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const produto_id = getProduto_Id();
    console.log("Produto ID:", produto_id); // Debug: Verifique o produto_id
    createVariante(formData, produto_id);

    // Debug: Verifique o conteúdo do formData
    formData.forEach((value, key) => {
        console.log(key, value);
    });
});

function getProduto_Id() {
    const url = window.location.href;
    const parts = url.split('/');
    const id = parts.pop();
    return id;
}

function createVariante(formData, produto_id) {
    fetch("/variante/create/" + produto_id, {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if (res.status === 200) {
            window.location.href = "/admin/lista/variante/" + produto_id
        }
    })
    .catch(error => {
        alert('Erro ao salvar nova variante, confira os logs');
        console.log(error);
    });
}

function loadFile(event) {
    var output = document.getElementById('imagem-preview');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
}