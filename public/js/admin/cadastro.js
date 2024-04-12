
const variantes = document.getElementById('variantes')

async function cadastrar(){
    const produto = {
        nome_produto: document.querySelector('[name=nome_produto]').value,
        descricao_produto: document.querySelector('[name=descricao_produto]').value,
        status_produto: true,
        modelo_produto: document.querySelector('[name=modelo_produto]').value, 
        marca: document.querySelector('[name=marca]').value, 
        categoria: document.querySelector('[name=categoria]').value
    }
    const variantes = []

    const formulariosVariantes = document.querySelectorAll('[name=variante]')
    for(let i = 0; i < formulariosVariantes.length; i++){
        const objeto = {
            preco: document.querySelectorAll('[name=preco]')[i].value,
            tamanho: document.querySelectorAll('[name=tamanho]')[i].value,
            quantidade: document.querySelectorAll('[name=quantidade]')[i].value,
            referencia: document.querySelectorAll('[name=referencia]')[i].value,
            ean: document.querySelectorAll('[name=ean]')[i].value,
            estoque: document.querySelectorAll('[name=estoque]')[i].value,
            custo: document.querySelectorAll('[name=custo]')[i].value,
            imagem: document.querySelectorAll('[name=imagem]')[i].files[0]
        }
        variantes.push(objeto)
    }
 



    const formData = new FormData();
    formData.append('produto', JSON.stringify(produto));

    // Adicione cada arquivo 'imagem' ao FormData
    document.querySelectorAll('[name=imagem]').forEach(input => {
        formData.append('imagens', input.files[0]);
    });
    
    // Adicione o array de variantes ao FormData
    formData.append('variantes', JSON.stringify(variantes));

    // Enviar os dados para o servidor
    const res = await fetch('/api/produto', {
        method: 'POST',
        body: formData
    });

    // Lidar com a resposta do servidor
    console.log(res);

}

function adicionarVariante() {
    // Cria um novo elemento div para envolver os campos da variante
    const divVariante = document.createElement('div');
    divVariante.classList.add('bg-gray-100', 'grid', 'grid-cols-2', 'gap-4', 'p-4');
    divVariante.setAttribute('name', 'variante');

    // Adiciona os campos da variante ao novo elemento div
    divVariante.innerHTML = `
        <input type="text" placeholder="preco" class="px-4 py-2 border" name="preco">
        <input type="text" placeholder="tamanho" class="px-4 py-2 border" name="tamanho">
        <input type="text" placeholder="quantidade" class="px-4 py-2 border" name="quantidade">
        <input type="text" placeholder="referencia" class="px-4 py-2 border" name="referencia">
        <input type="text" placeholder="ean" class="px-4 py-2 border" name="ean">
        <input type="text" placeholder="estoque" class="px-4 py-2 border" name="estoque">
        <input type="text" placeholder="custo" class="px-4 py-2 border" name="custo">
        <input type="file" placeholder="imagem" class="px-4 py-2 border" name="imagem">
    `;

    // Adiciona o novo elemento div ao elemento com id 'variantes'
    variantes.appendChild(divVariante);
}



