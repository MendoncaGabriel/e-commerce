const carrinhoComponent = document.getElementById('carrinho');
const listaProdutosCarrinho = document.getElementById('listaProdutosCarrinho');
const subtotal = document.getElementById('subtotal');
const itensNoCarrinho = document.getElementById('itensNoCarrinho');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

class Cookies {
    constructor(name, days){
        this.name = name;
        this.days = days;
    };

    set(value) {
        if (typeof this.name !== 'string'  || typeof this.days !== 'number' || this.days <= 0) return  console.log('Parâmetros inválidos para setCookie.');
        if(typeof value !== 'string') value = JSON.stringify(value);
        
        const expires = new Date();
        expires.setTime(expires.getTime() + this.days * 24 * 60 * 60 * 1000);
        document.cookie = `${this.name}=${value}; expires=${expires.toUTCString()}; path=/`;
        return console.log('Item salvo em cookie')
    }

    get() {
        if (typeof this.name !== 'string') {
            console.error('Parâmetro inválido para getCookie.');
            return null;
        }
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        if(cookies) {
            const cookie = cookies.find(cookie => cookie.startsWith(`${this.name}=`));
            return cookie ? JSON.parse(cookie.substring(this.name.length + 1)) : null;
        }
        return [];
    }

    remove() {
        if (typeof this.name !== 'string') {
            console.error('Parâmetro inválido para removeCookie.');
            return;
        }
        document.cookie = `${this.name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        return {
            msg: 'Item removido de cookie',
            name: this.name
        }
    }
    removeItem(index) {
        // Obter o carrinho atual de cookies
        const cookies = JSON.parse(this.get());
        delete cookies[index]
        this.set(JSON.stringify(cookies))
        console.log(`Item no indice ${index} removido`)
    }
}
class ControlesCarrinho {
    #cookie = new Cookies('carrinho', 30)

    alertaQTD(){
        if(this.#cookie && this.#cookie != '[]'){
            const qtd = this.#cookie.length;
            itensNoCarrinho.innerText = qtd;
            itensNoCarrinho.classList.replace('hidden', 'flex');
        }else{
            itensNoCarrinho.classList.replace('flex','hidden');
        };
    };
    liDefault(){
        let li = `<li class="py-2 px-4 border border-blue-500 rounded-full text-blue-500 flex items-center justify-between space-x-2 w-[80%] m-auto ">
            <i class="bi bi-exclamation-circle leading-3"></i>
            <p class="text-sm">O carrinho de compras esta vazio</p>
        </li>`;

        return li;
    };
    liItem({nome, quantidade, preco, variante_id}) {
        if(!nome) return console.log('Faltando nome para li');
        if(!quantidade) return console.log('Faltando quantidade para li');
        if(!preco) return console.log('Faltando preco para li');
        if(!variante_id) return console.log('Faltando variante_id para li');

        let li = `
        <li class=" text-left bg-gray-50 my-2 text-sm p-5 relative shadow-sm">
            <p><b>Produto:</b> ${nome}</p>
            <hr class="my-2">
            <p><b>Quantidade:</b> ${quantidade}</p>
            <p><b>Valor:</b> <span class=" font-semibold">R$${preco.replace('.', ',')}</span></p>
            <p><b>Total:</b> <span class="text-green-600 text-xl font-semibold">R$${Number(preco * qtdProduto).toFixed(2)}</span> x <span class="text-green-600 text-xl font-semibold">${e.qtdProduto}</span></p>
            <button onclick="carrinho.remover(${variante_id})" class=" ml-auto block absolute right-4 bottom-2">
                <i class="bi bi-trash2-fill text-red-400 text-3xl"></i>
            </button>
        </li>
        `;
        return li;
    };
    abrir(){
        this.carregar()
        carrinhoComponent.classList.remove('hidden')
        setTimeout(() => {
            carrinhoComponent.classList.replace('left-[-100%]', 'left-0')
        }, 30);
    };
    fechar(){
    
        carrinhoComponent.classList.add('left-[-100%]')
        setTimeout(() => {
            carrinhoComponent.classList.add('hidden')
        }, 300);
    };
    carregar(){
        const carrinho = this.#cookie.get();
        if(!carrinho || carrinho == []) return;

        let lista = this.liDefault();
        if(carrinho.length > 0){
            listaProdutosCarrinho.innerHTML = lista.
            subtotal.innerText = 'R$00,00'
            btnFinalizarCompra.classList.add('hidden')
            console.log('Sem produtos no carrinho')
            return
        };
        console.log('Com produtos no carrinho')
        let totalCarrinho = 0;
        lista = '';
        carrinho.map(e => {
            totalCarrinho = totalCarrinho + (e.qtdProduto * e.preco);
            lista += this.liItem(e.nome, e.quantidade, e.preco, e.variante_id)
        });

        listaProdutosCarrinho.innerHTML = lista;
        subtotal.innerText = `R$${String(Number(totalCarrinho).toFixed(2)).replace('.', ',')}`
        btnFinalizarCompra.classList.remove('hidden')

    };
}
class Carrinho extends ControlesCarrinho {
    #cookie = new Cookies('carrinho', 30);

    set(item){
        // Verificar item
        if(typeof item != 'object') return console.error('Item a ser adicionado não e um objeto!', item);
        const carrinho = this.#cookie.get('carrinho');
        if(carrinho && carrinho != null){
            carrinho.push(item);
            this.#cookie.set(carrinho);
        }else{
            this.#cookie.set([item]);
        };
    }

    get (){
        return this.#cookie.get('carrinho') ;
    }
}
const carrinho = new Carrinho();
window.carrinho = carrinho;