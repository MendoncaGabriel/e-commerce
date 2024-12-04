const formUpdateProduto = document.getElementById('formUpdateProduto');

formUpdateProduto.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(formUpdateProduto); // Use formUpdateProduto para obter o FormData
    const id = document.querySelector('[name=id]').value;
    updateProduto(formData, id);
});

function updateProduto(formData, id) {

    fetch(`/produto/update/${id}`, {
        method: 'PATCH',
        body: formData
    })
    .then(res => {
        if (res.status === 200) {
            window.location.href = '/admin/lista/produto';
        }
    })
    .catch(error => {
        alert('Erro ao atualizar produto, confira os logs');
        console.error(error);
    });
}

function loadFile(event) {
    var output = document.getElementById('imagem-preview');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
}