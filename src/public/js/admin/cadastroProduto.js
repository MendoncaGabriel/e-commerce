const variantes = document.getElementById('variantes')
const tituloVariante = document.getElementById('tituloVariante')
const btnCadastrar = document.getElementById('btnCadastrar')

const HandleBtnCadastrar = {
    iconeLoad: () => {
        btnCadastrar.onclick = null;
        btnCadastrar.innerHTML = `
        <div role="status">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        </div>
        `;
    },

    pararLoad: () => {
        btnCadastrar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-floppy2-fill" viewBox="0 0 16 16">
            <path d="M12 2h-2v3h2z"/>
            <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5V2.914a1.5 1.5 0 0 0-.44-1.06L14.147.439A1.5 1.5 0 0 0 13.086 0zM4 6a1 1 0 0 1-1-1V1h10v4a1 1 0 0 1-1 1zM3 9h10a1 1 0 0 1 1 1v5H2v-5a1 1 0 0 1 1-1"/>
        </svg>
        <p>
            CADASTRAR
        </p>
        `
    }
}
const Cadastro = {
    salvar: async () => {
        HandleBtnCadastrar.iconeLoad()
        const formData = new FormData();

        // Produto
        const produto = {
            nome: document.querySelector('[name=nome]').value,
            descricao: document.querySelector('[name=descricao]').value,
            ativo: true,
            modelo: document.querySelector('[name=modelo]').value, 
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
        if(res.status == 200){
            HandleBtnCadastrar.pararLoad()
            window.location.href = '/admin/lista/produto'
            console.log(res);
        }else{
            const resJson = await res.json()
            console.log(resJson)
            alert('Erro ao cadastrar, confira os logs.')
        }
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
            <h2 class="col-span-2 text-gray-700 font-semibold text-2xl text-center p-4" >Variante</h2>

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
                    <img src="/assets/produto-default.png" alt="imagem do produto" class="w-80 aspect-square  m-auto rounded-lg shadow-md object-cover">

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