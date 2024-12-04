const formCreateProduto = document.getElementById('formCreateProduto');

formCreateProduto.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    createProduto(formData);
});

function createProduto(formData){
    fetch("/produto/create", {
        method: 'POST',
        body: formData
    })
    .then(res => {
        if(res.status == 200) window.location.href = '/admin/lista/produto';
    })
    .catch(error => {
        alert('Erro ao salvar novo produto, confira os logs');
        console.log(error);
    });
};

function loadFile(event) {
    var output = document.getElementById('imagem-preview');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
    }
};



document.querySelectorAll('[data-mascara="ean13"]').forEach(element => {
    new Cleave(element, {
        numericOnly: true, // Apenas números
        blocks: [13], // Apenas um bloco de 13 dígitos
    });
});
