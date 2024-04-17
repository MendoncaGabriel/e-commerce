const variantes = document.getElementById('variantes')
const tituloVariante = document.getElementById('tituloVariante')


const Cadastro = {
    salvar: async () => {
        const formData = new FormData();

        // Produto
        const produto = {
            nome_produto: document.querySelector('[name=nome_produto]').value,
            descricao_produto: document.querySelector('[name=descricao_produto]').value,
            status_produto: true,
            modelo_produto: document.querySelector('[name=modelo_produto]').value, 
            marca: document.querySelector('[name=marca]').value, 
            categoria: document.querySelector('[name=categoria]').value
        }
        formData.append('produto', JSON.stringify(produto));

        // Variantes
        const variantes = []
        const formulariosVariantes = document.querySelectorAll('[name=varianteElement]')
        for (let i = 0; i < formulariosVariantes.length; i++) {
            const variante = {
                preco: document.querySelectorAll('[name=preco]')[i].value,
                tamanho: document.querySelectorAll('[name=tamanho]')[i].value,
                quantidade: document.querySelectorAll('[name=quantidade]')[i].value,
                referencia: document.querySelectorAll('[name=referencia]')[i].value,
                ean: document.querySelectorAll('[name=ean]')[i].value,
                estoque: document.querySelectorAll('[name=estoque]')[i],
                custo: document.querySelectorAll('[name=custo]')[i]
            };
            // Imagens
            var fileInput = document.querySelectorAll('[name=imagem]')[i].files[0];
            var imageName = fileInput ? fileInput.name : null;
            if(imageName) {
                formData.append('imagens', fileInput);
                variante.imagem = imageName
                console.log(imageName)
            }

            variantes.push(variante)
        }
        formData.append('variantes', JSON.stringify(variantes));

        // Enviar os dados para o servidor
        const res = await fetch('/api/produto', {
            method: 'POST',
            body: formData
        });
        console.log(res);
    }
}


const Variante = {
    remover: (btn) => {
        console.log(btn.parentNode.remove())
    },

    adicionar: () => {
        tituloVariante.classList.remove('hidden')
        const divVariante = document.createElement('div');
        divVariante.innerHTML = `
        <div name="varianteElement" class="col-span-2  border shadow-lg p-5 bg-gray-50  ">
            <button onclick="Variante.remover(this)" class="bg-red-500 ml-auto text-white px-4 py-2 w-32 flex items-center justify-center space-x-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
                <p>remover</p>
            </button>

            <!-- formulario variantes -->
            <div class="grid grid-cols-2  w-full col-span-2">
                <div class="text-gray-700 space-y-5" name="variante">
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
                    <img src="/produto-default.png" alt="imagem do produto" class="w-80 aspect-square  m-auto rounded-lg shadow-md object-cover">

                    <div class="m-auto   p-5 flex flex-col items-center">
                        <label for="">Imagem</label><br>
                        <input type="file" placeholder="imagem"     class="px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg  bg-white inputImage" name="imagem">
                    </div>
                </div>  
            </div>
        <div>`;

        // Adiciona o novo elemento div ao elemento com id 'variantes'
        variantes.appendChild(divVariante);
        Variante.imagemInput()

        setTimeout(() => {
            Variante.rolarTela('variantes')
        }, 100);
    },

    imagemInput: () => {
        const inputImage = document.querySelectorAll('.inputImage');

        // Define a função que será chamada quando o evento de mudança ocorrer
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
    },

    rolarTela: (id) => {
        const variantesDiv = document.getElementById(id);
        variantesDiv.scrollIntoView({ behavior: 'smooth',  block: 'end' });
    }
};