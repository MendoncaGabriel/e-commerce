const carrinhoComponent = document.getElementById('carrinho');
const listaProdutosCarrinho = document.getElementById('listaProdutosCarrinho');
const subtotal = document.getElementById('subtotal');
const itensNoCarrinho = document.getElementById('itensNoCarrinho');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
const contaionerFinalizarCarrinho = document.getElementById('contaionerFinalizarCarrinho');

//ABRIR E FECHAR
function abrirCarrinho() {
    carregarCarrinho();
    carrinhoComponent.classList.replace('hidden', 'flex');
    setTimeout(() => carrinhoComponent.classList.replace('left-[-100%]', 'left-[0%]'), 100);
};
function fecharCarrinho() {
    carrinhoComponent.classList.replace('left-[0%]', 'left-[-100%]');
    setTimeout(() => carrinhoComponent.classList.replace('flex', 'hidden'), 250);
};
function converterEmRealCarrinho(precoString) {
    const precoNumero = Number(precoString).toFixed(2);

    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return formatoMoeda.format(precoNumero);
};

//COMPONENTES
const carrinhovazio = () => ` 
<li class="py-2 px-4 border border-c1 rounded-full text-c1 flex items-center  space-x-2 w-[80%] m-auto ">
<i class="bi bi-exclamation-circle leading-3"></i>
<p class="text-sm">O carrinho de compras esta vazio</p>
</li>`
const itemCarrinho = (imagem, quantidade, preco, variante_id) => `
<li id="li${variante_id}" class="bg-gray-100 p-2 border grid grid-cols-10  duration-300">
    <div class="col-span-3 aspect-square  border-c1 ">
        <img 
            src="/img/${imagem}" 
            alt=""
            class="h-full max-[95.84px]: aspect-square rounded-md shadow "
            onerror="this.src='/assets/produto-default.png'"
        >
    </div>
    <div class="col-span-7  border-c1 text-sm text-left pl-2 min-h-auto">
        <h2 class=""><b>Nome do produto grande aqui...</b></h2>
        <p class="" >Preço: ${converterEmRealCarrinho(preco)}</p>
        <p class="" >Quantidade: <span id="qtd${variante_id}">${quantidade}</span> </p>
        <p class="">Total: <span class="text-c1 font-bold text-lg " id="total${variante_id}">${converterEmRealCarrinho(Number(preco) * Number(quantidade))} </span></p>
    </div>

    <div class="col-span-10  border-c1  flex justify-between pt-2">
        <!-- Setar Quantidade -->
        <div class="border-2 w-24 md:w-full md:max-w-[140px] rounded-lg border-c1 flex items-center justify-around bg-white">
            <button onclick="menosQtdCarrinho(${variante_id})"  class="text-3xl    flex items-center justify-center"><i class="bi bi-dash-circle leading-3 text-c1 hover:text-c2 duration-100"></i></button>
            <input readonly id="qtdCarrinho${variante_id}" type="number" value="${quantidade}" class=" text-center text-xl w-5 md:w-10 flex items-center justify-center  focus:outline-none text-c1">
            <button onclick="maisQtdCarrinho(${variante_id})"  class="text-3xl   flex items-center justify-center"><i class="bi bi-plus-circle-fill leading-3 text-c1 hover:text-c2 duration-100"></i></button>
        </div>

        <!-- Remover -->
        <button class="" onclick="removerCarrinho(${variante_id})">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-trash text-c1 hover:text-c2 duration-100" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        </button>
    </div>
</li>`;


// MAIS OU MENOS NO CARRINHO
function menosQtdCarrinho(variante_id) {
    if (localStorage.carrinho) {
        const carrinho = JSON.parse(localStorage.carrinho);
        carrinho.forEach(item => {
            if (item.variante_id == variante_id) {
                const quantidade = document.getElementById(`qtdCarrinho${variante_id}`);
                if (item.qtd > 1) {
                    item.qtd--
                    quantidade.value--
                    localStorage.carrinho = JSON.stringify(carrinho);
                    carregarCarrinho();
                };
            };
        });
    };
};
function maisQtdCarrinho(variante_id) {
    if (localStorage.carrinho) {
        const carrinho = JSON.parse(localStorage.carrinho);

        carrinho.forEach(item => {
            if (item.variante_id == variante_id) {
                const quantidade = document.getElementById(`qtdCarrinho${variante_id}`);

                if (item.qtd < item.estoque) {
                    item.qtd++;
                    quantidade.value++;
                    localStorage.carrinho = JSON.stringify(carrinho);
                    carregarCarrinho()
                };
            };
        });

    }
};
function removerCarrinho(variante_id) {

    if (localStorage.carrinho) {
        const carrinho = JSON.parse(localStorage.carrinho);
        const itemRemovido = carrinho.filter(e => e.variante_id != variante_id);
        const li = document.getElementById(`li${variante_id}`);
        li.classList.add('transform', 'ease-linear', '-translate-x-full', 'opacity-0');

        setTimeout(() => {
            li.classList.add('h-5');
            li.remove();
            localStorage.carrinho = JSON.stringify(itemRemovido);
            carregarCarrinho();
            notificarItemCarrinho()

        }, 250);
    }
}


//CARREGAR
function carregarCarrinho() {

    if (!localStorage.carrinho) {
        listaProdutosCarrinho.innerHTML = carrinhovazio();
        return;
    };

    const carrinho = JSON.parse(localStorage.carrinho);
    if (carrinho.length == 0) {
        subtotal.innerText = 'R$ 00,00';
        listaProdutosCarrinho.innerHTML = carrinhovazio();
        contaionerFinalizarCarrinho.classList.add('hidden');
        return;
    };

    listaProdutosCarrinho.innerHTML = '';
    let total = 0;
    carrinho.forEach(item => {
        console.log(`item.qtd: ${item.qtd} || item.preco: ${item.preco}`)

        if (typeof item.qtd != "undefined" && typeof item.preco != "undefined" && item != {}) {

            total += Number(item.qtd) * Number(item.preco);
        }
        listaProdutosCarrinho.innerHTML += itemCarrinho(item.imagem, item.qtd, item.preco, item.variante_id);
    });

    console.log(total)

    contaionerFinalizarCarrinho.classList.remove('hidden');
    subtotal.innerText = converterEmRealCarrinho(total);
    notificarItemCarrinho()



}

function finalizarCompraCarrinho() {
    if (!localStorage.carrinho) alert('Você não tem produtos no carrinho!');
    const carrinho = [];

    // varilar itens no carrinho
    JSON.parse(localStorage.carrinho).forEach(item => {
        if (typeof item.qtd != "undefined" && typeof item.preco != "undefined" && item != {}) {
            carrinho.push(item);
        };
    });

    addCarrinhoCookie(carrinho)
}

function addCarrinhoCookie(data) {
    // LIMPAR, APENAD DADOS NECESSARIOS
    const carrinho = []

    data.forEach(e => {
        carrinho.push({
            qtd: e.qtd,
            variante_id: e.variante_id,
            produto_id: e.produto_id
        })
    });


    const dadosString = JSON.stringify(carrinho);

    // Calcular a data de expiração em 30 dias a partir de hoje
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 30);

    // Definir o cookie com os dados e a data de expiração
    document.cookie = `carrinho=${dadosString}; expires=${dataExpiracao.toUTCString()}; path=/`;


    if (document.cookie) {
        window.location.href = '/';
    }

}