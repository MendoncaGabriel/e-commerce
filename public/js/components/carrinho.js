const carrinhoComponent = document.getElementById('carrinho')
const listaProdutosCarrinho = document.getElementById('listaProdutosCarrinho')
const subtotal = document.getElementById('subtotal')

const Carrinho = {
    total: 0,
    subtotal: 0,
    quantidade: 0,
    itens: [],
    fechar: () => {
        carrinhoComponent.classList.add('right-[-100%]')
        setTimeout(() => {
            carrinho.classList.add('hidden')
        }, 300);
    },
    abrir: () => {
        Carrinho.caregar()
        carrinhoComponent.classList.remove('hidden')
        
        setTimeout(() => {
            carrinhoComponent.classList.replace('right-[-100%]', 'right-0')
        }, 30);
    },
    caregar: () => {
        if(localStorage.carrinho && localStorage.carrinho != "[]"){
            const carrinho = JSON.parse(localStorage.carrinho)
            let lista = ''
            Carrinho.subtotal = 0
            carrinho.map((e, index) => {
                Carrinho.subtotal += Number(e.preco * e.qtdProduto)
                lista += `
                <li class=" text-left bg-gray-50 my-2 text-sm p-5 relative shadow-sm">
                    <p><b>Produto:</b> ${e.nome_produto}</p>
                    <hr class="my-2">
                    <p><b>Quantidade:</b> ${e.quantidade}</p>
                    <p><b>Valor:</b> <span class=" font-semibold">R$${e.preco.replace('.', ',')}</span></p>
                    <p><b>Total:</b> <span class="text-green-600 text-xl font-semibold">R$${String(e.preco * e.qtdProduto).replace('.', ',')}</span> x <span class="text-green-600 text-xl font-semibold">${e.qtdProduto}</span></p>

                    <button onclick="Carrinho.remover(${e.variante_id}, ${index})" class=" ml-auto block absolute right-4 bottom-2">
                        <i class="bi bi-trash2-fill text-red-400 text-3xl"></i>
                    </button>
                </li>
                `
            });
            listaProdutosCarrinho.innerHTML = lista
            subtotal.innerText = `R$${String(Number(Carrinho.subtotal).toFixed(2)).replace('.', ',')}`
    

        }else{
            listaProdutosCarrinho.innerHTML = `
            <li class="py-2 px-4 border border-blue-500 rounded-full text-blue-500 flex items-center justify-between space-x-2 w-[80%] m-auto">
                <i class="bi bi-exclamation-circle leading-3"></i>
                <p class="text-sm">O carrinho de compras esta vazio</p>
            </li>
            `
            subtotal.innerText = `R$00,00`
        }
    },
    adicionar: (item) => {
        if(!localStorage.carrinho){
            localStorage.carrinho = JSON.stringify([item])
        }else{
            const carrinho = JSON.parse(localStorage.carrinho)
            carrinho.push(item)
            localStorage.carrinho = JSON.stringify(carrinho)
        }
        Carrinho.fechar()
        Carrinho.caregar()
        carregarIndicadorCarrinho()
    },
    remover: (id,index) => {
        
        const carrinho = JSON.parse(localStorage.carrinho)
        let novoCarrinho = carrinho.filter((e, i) => e.variante_id !== Number(id) || i !== index)
        localStorage.carrinho = JSON.stringify(novoCarrinho)
    
        Carrinho.caregar()
        carregarIndicadorCarrinho()
   
    },
}