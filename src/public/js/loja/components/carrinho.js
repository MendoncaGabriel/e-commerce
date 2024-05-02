const carrinhoComponent = document.getElementById('carrinho');
const listaProdutosCarrinho = document.getElementById('listaProdutosCarrinho');
const subtotal = document.getElementById('subtotal');
const itensNoCarrinho = document.getElementById('itensNoCarrinho');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

//ABRIR E FECHAR
function abrirCarrinho(){
    carregarCarrinho();
    carrinhoComponent.classList.replace('hidden', 'flex');
    setTimeout(()=>  carrinhoComponent.classList.replace('left-[-100%]', 'left-[0%]'), 100);
};
function fecharCarrinho(){
    carrinhoComponent.classList.replace('left-[0%]', 'left-[-100%]');
    setTimeout(()=> carrinhoComponent.classList.replace('flex', 'hidden') , 250);
};
function converterEmRealCarrinho(precoString){
    const precoNumero = parseFloat(precoString);

    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return formatoMoeda.format(precoNumero);
};

const carrinhovazio = () => ` <li class="py-2 px-4 border border-blue-500 rounded-full text-blue-500 flex items-center justify-between space-x-2 w-[80%] m-auto ">
<i class="bi bi-exclamation-circle leading-3"></i>
<p class="text-sm">O carrinho de compras esta vazio</p>
</li>`

const itemCarrinho = (imagem, quantidade, preco, variante_id) => `
<li class="bg-gray-100 p-2 border grid grid-cols-10 ">
    <div class="col-span-3 aspect-square  border-red-600 ">
        <img 
            src="/img/${imagem}" 
            alt=""
            class="h-full max-[95.84px]: aspect-square rounded-md shadow "
            onerror="this.src='/assets/produto-default.png'"
        >
    </div>
    <div class="col-span-7  border-red-600 text-sm text-left pl-2 min-h-auto">
        <h2 class=""><b>Nome do produto grande aqui...</b></h2>
        <p class="" >Preço: ${converterEmRealCarrinho(preco)}</p>
        <p class="" >Quantidade: <span id="qtd${variante_id}">${quantidade}</span> </p>
        <p class="">Total: <span class="text-blue-500 text-lg font-normal" id="total${variante_id}">${converterEmRealCarrinho(Number(preco) * Number(quantidade)) } </span></p>
    </div>

    <div class="col-span-10  border-red-600  flex justify-between pt-2">
        <!-- Setar Quantidade -->
        <div class="border w-24 rounded-lg border-blue-400 flex items-center justify-around bg-white">
            <button onclick="menosQtdCarrinho(${variante_id})"  class="text-3xl    flex items-center justify-center"><i class="bi bi-dash-circle leading-3 text-blue-400"></i></button>
            <input readonly id="qtdCarrinho${variante_id}" type="number" value="${quantidade}" class="border-b text-center text-xl w-5 focus:outline-none text-gray-700">
            <button onclick="maisQtdCarrinho(${variante_id})"  class="text-3xl   flex items-center justify-center"><i class="bi bi-plus-circle-fill leading-3 text-blue-400"></i></button>
        </div>

        <!-- Remover -->
        <button class="" onclick="removerCarrinho(${variante_id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-trash text-red-400" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        </button>
    </div>
</li>`;

// MAIS OU MENOS NO CARRINHO
function menosQtdCarrinho(variante_id){
    if(localStorage.carrinho){
        const carrinho = JSON.parse(localStorage.carrinho);
        carrinho.forEach(item => {
            if(item.variante_id == variante_id){
                const quantidade = document.getElementById(`qtdCarrinho${variante_id}`);
                if(item.qtd > 1){
                    item.qtd--
                    quantidade.value--
                    localStorage.carrinho = JSON.stringify(carrinho);
                    carregarCarrinho();
                };
            };
        });
    };
};
function maisQtdCarrinho(variante_id){
    console.log('variante_id: '+variante_id)
    if(localStorage.carrinho){
        const carrinho = JSON.parse(localStorage.carrinho);

        carrinho.forEach(item => {
            console.log(item)
            if(item.variante_id == variante_id){
                const quantidade = document.getElementById(`qtdCarrinho${variante_id}`);

                console.log('qtd: '+item.qtd, 'estoque: '+item.estoque)

                if(item.qtd < item.estoque){
                    item.qtd++;
                    quantidade.value++;
                    localStorage.carrinho = JSON.stringify(carrinho);
                    carregarCarrinho()
                };
            };
        });

    }
}


function removerCarrinho(variante_id){
    if(localStorage.carrinho){
        const carrinho = JSON.parse(localStorage.carrinho);
        const itemRemovido = carrinho.filter(e => e.variante_id != variante_id);

        localStorage.carrinho = JSON.stringify(itemRemovido);
        carregarCarrinho()

    }
}



//CARREGAR
function carregarCarrinho(){
    notificarItemCarrinho()
    if(!localStorage.carrinho){
        listaProdutosCarrinho.innerHTML = carrinhovazio();
        return;
    };

    const carrinho = JSON.parse(localStorage.carrinho);
    if(carrinho.length == 0){
        subtotal.innerText = 'R$ 00,00';
        listaProdutosCarrinho.innerHTML = carrinhovazio();
        return;
    };

    listaProdutosCarrinho.innerHTML = '';
    let total = 0;
    carrinho.forEach(item => {
        total += Number(item.qtd) * Number(item.preco);
        listaProdutosCarrinho.innerHTML += itemCarrinho(item.imagem, item.qtd, item.preco, item.variante_id);
    });

    subtotal.innerText = converterEmRealCarrinho(total);
    
  

}