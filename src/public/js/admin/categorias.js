const inputUpdateCategoria = document.querySelector("#inputUpdateCategoria");
const inputCreateCategoria = document.querySelector("#inputCreateCategoria");

function editar(btn) {

    const id = btn.getAttribute('categoria_id');
    const nome = btn.getAttribute('nome');
    console.log(id, nome)

    inputUpdateCategoria.value = nome;
    inputUpdateCategoria.setAttribute('categoria_id', id.toString());
}

document.getElementById("createForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const nome = inputCreateCategoria.value;


    fetch('/categoria/create', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({ nome: nome })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Sucesso:', data);
        location.reload();
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

document.getElementById("updateForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const id = inputUpdateCategoria.getAttribute('categoria_id');
    const nome = inputUpdateCategoria.value;

    fetch('/categoria/update/' + id, {
        headers: {'Content-Type': 'application/json'},
        method: 'PATCH',
        body: JSON.stringify({ nome: nome })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Sucesso:', data);
        location.reload();
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});


function deleteCategoria(id) {
    const confirmation = prompt('Tem certeza de que deseja prosseguir? Alguns produtos podem estar relacionados a esta categoria. Por favor, escolha uma opção: sim / não.');
    if (confirmation.toLowerCase() !== "sim") return;

    fetch(`/categoria/delete/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        } else {
            return response.json().then(errorData => {
                throw new Error(errorData.error.sqlMessage || 'Erro desconhecido ao tentar deletar a categoria.');
            });
        }
    })
    .catch(error => {
        alert('Não é possível apagar esta categoria, pois existem produtos associados a ela.');
        console.log(error);
    });
}

