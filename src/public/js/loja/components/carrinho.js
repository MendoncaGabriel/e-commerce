const itemCarrinho = (imagem, quantidade, preco, varianteId) => `
<li id="li${varianteId}" class="bg-gray-100 p-2 border grid grid-cols-10 duration-300">
    <div class="col-span-3 aspect-square border-c1">
        <img 
            src="/img/produtos/${imagem}" 
            alt=""
            class="h-full max-[95.84px]:aspect-square rounded-md shadow"
            onerror="this.src='/assets/produto-default.png'"
        >
    </div>
    <div class="col-span-7 border-c1 text-sm text-left pl-2 min-h-auto">
        <h2><b>Nome do produto grande aqui...</b></h2>
        <p>Preço: ${Utilitarios.toReal(preco)}</p>
        <p>Quantidade: <span id="qtd${varianteId}">${quantidade}</span></p>
        <p>Total: <span class="text-c1 font-bold text-lg" id="total${varianteId}">${Utilitarios.toReal(preco * quantidade)}</span></p>
    </div>
    <div class="col-span-10 border-c1 flex justify-between pt-2">
        <!-- Setar Quantidade -->
        <div class="border-2 w-24 md:w-full md:max-w-[140px] rounded-lg border-c1 flex items-center justify-around bg-white">
            <button onclick="Item.menos(${varianteId})" class="text-3xl flex items-center justify-center"><i class="bi bi-dash-circle leading-3 text-c1 hover:text-c2 duration-100"></i></button>
            <input readonly id="qtdCarrinho${varianteId}" type="number" value="${quantidade}" class="text-center text-xl w-5 md:w-10 flex items-center justify-center focus:outline-none text-c1">
            <button onclick="Item.mais(${varianteId})" class="text-3xl flex items-center justify-center"><i class="bi bi-plus-circle-fill leading-3 text-c1 hover:text-c2 duration-100"></i></button>
        </div>
        <!-- Remover -->
        <button onclick="Item.remover(${varianteId})">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-trash text-c1 hover:text-c2 duration-100" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        </button>
    </div>
</li>`;
const carrinhoVazio = () => `
<li class="py-2 px-4 border border-c1 rounded-full text-c1 flex items-center space-x-2 w-[80%] m-auto ">
    <i class="bi bi-exclamation-circle leading-3"></i>
    <p class="text-sm">O carrinho de compras está vazio</p>
</li>`;


class Utilitarios {
    static toReal(preco) {
        const precoNumero = Number(preco).toFixed(2);
        const formatoMoeda = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return formatoMoeda.format(precoNumero);
    }

    static setCookie(name, value, days) {
        if (typeof name !== 'string' || typeof days !== 'number' || days <= 0) {
            console.error('Parâmetros inválidos para setCookie.');
            return;
        }

        const toStringValues = JSON.stringify(value);
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${toStringValues}; expires=${expires.toUTCString()}; path=/`;
        return {
            msg: 'Item salvo em Cookies',
            name: name,
            value: toStringValues
        };
    }

    static redirect(caminho) {
        window.location.href = caminho;
    }
}

class Item {
    static mais(id) {
        const carrinho = JSON.parse(localStorage.carrinho);
        carrinho.forEach(item => {
            if (Number(item.variante_id) === Number(id) || Number(item.produto_id) === Number(id)) {
                const quantidade = document.getElementById(`qtdCarrinho${id}`);
                item.qtd++;
                quantidade.value++;
                localStorage.carrinho = JSON.stringify(carrinho);
                carregarCarrinho();
            }
        });
    }

    static menos(id) {
        const carrinho = JSON.parse(localStorage.carrinho);
        carrinho.forEach(item => {
            if (Number(item.variante_id) === Number(id) || Number(item.produto_id) === Number(id)) {
                const quantidade = document.getElementById(`qtdCarrinho${id}`);
                if (Number(item.qtd) > 1) {
                    item.qtd--;
                    quantidade.value--;
                    localStorage.carrinho = JSON.stringify(carrinho);
                    carregarCarrinho();
                }
            }
        });
    }

    static remover(id) {
        const carrinho = JSON.parse(localStorage.carrinho);
        const newCarrinho = carrinho.filter(item => item.variante_id !== id || (item.produto_id === id && !item.variante_id));

        const li = document.getElementById(`li${id}`);
        li.classList.add('transform', 'ease-linear', '-translate-x-full', 'opacity-0');

        setTimeout(() => {
            li.remove();
            localStorage.carrinho = JSON.stringify(newCarrinho);
            carregarCarrinho();
            notificarItemCarrinho();
        }, 300);
    }
}

class Carrinho  {
    constructor(){
        this.carrinho = document.getElementById('carrinho');
        this.subtotal = document.getElementById('subtotal');
        this.btnAbrir = document.getElementById('btnAbrirCarrinho');
        this.btnFechar = document.getElementById('btnFecharCarrinho');
        this.itensNoCarrinho = document.getElementById('itensNoCarrinho');
        this.listaProdutos = document.getElementById('listaProdutosCarrinho');
        this.btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
        this.contaionerFinalizarCarrinho = document.getElementById('contaionerFinalizarCarrinho');
        this.qtdCarrinho = document.getElementById('qtdCarrinho');
        this.qtdCarrinhoContainer = document.getElementById('qtdCarrinhoContainer');

        this.btnAbrir.addEventListener('click', () => this.abrir());
        this.btnFechar.addEventListener('click', () => this.fechar());
        this.btnFinalizarCompra.addEventListener('click', ()=> this.finalizarCompra());
    }

    finalizarCompra(){
        const carrinho = JSON.parse(localStorage.carrinho);

        const itens = carrinho.map(e => ({
            produto_id: e.produto_id,
            qtd: e.qtd,
            variante_id: e.variante_id
        }));

        Ultilitarios.setCookie("carrinho", itens, 30)
        Ultilitarios.redirect("/checkout")
    }
    abrir(){
        this.load()
        this.carrinho.classList.replace('hidden', 'flex');
        setTimeout(() => this.carrinho.classList.replace('left-[-100%]', 'left-[0%]'), 100);
    }
    fechar(){
        this.carrinho.classList.replace('left-[0%]', 'left-[-100%]');
        setTimeout(() => this.carrinho.classList.replace('flex', 'hidden'), 250);
    }
    load(){
        const carrinho = JSON.parse(localStorage.carrinho);
        this.listaProdutos.innerHTML = '';
        let total = 0;

        if (carrinho.length == 0) {
            this.subtotal.innerText = 'R$ 00,00';
            this.listaProdutos.innerHTML = carrinhovazio();
            this.contaionerFinalizarCarrinho.classList.add('hidden');
            return;
        };

        carrinho.forEach(item => {
            if (typeof item.qtd != "undefined" && typeof item.preco != "undefined" && item != {}) {
                total += Number(item.qtd) * Number(item.preco);
            }
            this.listaProdutos.innerHTML += itemCarrinho(item.imagem, item.qtd, item.preco, item.variante_id || item.produto_id);
        });

        this.contaionerFinalizarCarrinho.classList.remove('hidden');
        this.subtotal.innerText = Ultilitarios.toReal(total);
        this.alertItems()
    }
    alertItems(){
        const carrinho = JSON.parse(localStorage.carrinho);

        if(carrinho.length > 0){
            qtdCarrinhoContainer.classList.replace('hidden', 'flex');
            qtdCarrinho.innerText = carrinho.length;
        }else{
            qtdCarrinhoContainer.classList.replace('flex', 'hidden');
        }
    }
}


const carrinho = new Carrinho()
carrinho.alertItems()



//ULTILIRARIOS
function removeItemByIndex(arr, index) {
    if (index >= 0 && index < arr.length) {
        arr.splice(index, 1);
    }
    return arr;
}

