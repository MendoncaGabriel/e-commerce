
const variantes = document.getElementById('variantes')

async function cadastrar(){
    const formulariosVariantes = document.querySelectorAll('[name=variante]')
    const variantes = []
    const objetos = [];

    const produto = {
        nome_produto: document.querySelector('[name=nome_produto]').value,
        descricao_produto: document.querySelector('[name=descricao_produto]').value,
        status_produto: true,
        modelo_produto: document.querySelector('[name=modelo_produto]').value, 
        marca: document.querySelector('[name=marca]').value, 
        categoria: document.querySelector('[name=categoria]').value
    }

   for (let i = 0; i < formulariosVariantes.length; i++) {
        const precoInput = document.querySelectorAll('[name=preco]')[i];
        const tamanhoInput = document.querySelectorAll('[name=tamanho]')[i];
        const quantidadeInput = document.querySelectorAll('[name=quantidade]')[i];
        const referenciaInput = document.querySelectorAll('[name=referencia]')[i];
        const eanInput = document.querySelectorAll('[name=ean]')[i];
        const estoqueInput = document.querySelectorAll('[name=estoque]')[i];
        const custoInput = document.querySelectorAll('[name=custo]')[i];



        // Verifique se todos os inputs estão definidos antes de criar o objeto
        if (precoInput && tamanhoInput && quantidadeInput && referenciaInput && eanInput && estoqueInput && custoInput ) {
            const objeto = {
                preco: precoInput.value,
                tamanho: tamanhoInput.value,
                quantidade: quantidadeInput.value,
                referencia: referenciaInput.value,
                ean: eanInput.value,
                estoque: estoqueInput.value,
                custo: custoInput.value,
            };

            objetos.push(objeto);
        }
    }
    variantes.push(...objetos);
 



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

function rastrearInputFiles(){
    const inputImage = document.querySelectorAll('.inputImage');

    // // Define a função que será chamada quando o evento de mudança ocorrer
    function handleChange(event) {
        const file = event.target.files[0];
        const src = URL.createObjectURL(file);
        event.target.parentNode.parentNode.querySelector('img').src = src;
        
        // Remove o event listener após a execução da função
        event.target.removeEventListener('change', handleChange);
    }

    inputImage.forEach(e => {
        // Adiciona o event listener chamando a função handleChange
        e.addEventListener('change', handleChange);
    });

}

function adicionarVariante() {
    // Cria um novo elemento div para envolver os campos da variante
    const divVariante = document.createElement('div');
    divVariante.classList.add('bg-gray-100', 'grid', 'grid-cols-2', 'gap-4', 'p-4');
    divVariante.setAttribute('name', 'variante');

    // Adiciona os campos da variante ao novo elemento div
    divVariante.innerHTML = `
    <div class="grid grid-cols-2 border w-full col-span-2 p-10">
    <!-- formulario variantes -->
    <div class=" bg-gray-100  p-4 text-gray-700 space-y-5" name="variante">
        <div>
            <label for="">Preço</label>
            <input type="text" placeholder="preco"  name="preco"     class="px-4 py-2 border w-full" >
        </div>                   
        <div>
            <label for="">Tamanho</label>
            <input type="text" placeholder="tamanho"    class="px-4 py-2 border w-full" name="tamanho">
        </div>                
        <div>
            <label for="">Quantidade</label>
            <input type="text" placeholder="quantidade" class="px-4 py-2 border w-full" name="quantidade">
        </div>
        <div>
            <label for="">Referência</label>
            <input type="text" placeholder="referencia" class="px-4 py-2 border w-full" name="referencia">
        </div>
        <div>
            <label for="">Código de Barras</label>
            <input type="text" placeholder="ean"        class="px-4 py-2 border w-full" name="ean">
        </div>
        <div>
            <label for="">Estoque</label>
            <input type="text" placeholder="estoque"    class="px-4 py-2 border w-full" name="estoque">
        </div>
        <div>
            <label for="">Custo</label>
            <input type="text" placeholder="custo"      class="px-4 py-2 border w-full" name="custo">
        </div>

    </div>
    <!-- input de imagem  -->
    <div class="p-10 flex flex-col items-center">
        <img src="/produto-default.png" alt="imagem do produto" class="w-80 aspect-square object-cover m-auto">

        <div class="m-auto   p-5 flex flex-col items-center">
            <label for="">Imagem</label><br>
            <input type="file" placeholder="imagem"     class="px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg  bg-white inputImage" name="imagem">
        </div>
    </div>  
</div>
    `;

    // Adiciona o novo elemento div ao elemento com id 'variantes'
    variantes.appendChild(divVariante);
    rastrearInputFiles()
}



