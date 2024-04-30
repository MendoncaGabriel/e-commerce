const carrinhoComponent = document.getElementById('carrinho');
const listaProdutosCarrinho = document.getElementById('listaProdutosCarrinho');
const subtotal = document.getElementById('subtotal');
const itensNoCarrinho = document.getElementById('itensNoCarrinho');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

// class Carrinho {
//     constructor(){
//         this._total = 0;
//         this._subtotal = 0;
//         this._qtdItens = 0;
//         this._produtos = [];
//     }

//     alertaQTD(){
//         if(localStorage.carrinho && localStorage.carrinho != '[]'){
//             const carrinho = JSON.parse(localStorage.carrinho);
//             const qtd = carrinho.length;
//             itensNoCarrinho.innerText = qtd;
//             itensNoCarrinho.classList.replace('hidden', 'flex');
//         }else{
//             itensNoCarrinho.classList.replace('flex','hidden');
//         };
//     };
//     atualizarProdutos(){
//         this.alertaQTD();
//         let lista = ''
//         if(!localStorage.carrinho || localStorage.carrinho == '[]' ){

//             lista =  `<li class="py-2 px-4 border border-blue-500 rounded-full text-blue-500 flex items-center justify-between space-x-2 w-[80%] m-auto ">
//                 <i class="bi bi-exclamation-circle leading-3"></i>
//                 <p class="text-sm">O carrinho de compras esta vazio</p>
//             </li>`

//             listaProdutosCarrinho.innerHTML = lista
//             subtotal.innerText = `R$${String(Number(0).toFixed(2)).replace('.', ',')}`
//             btnFinalizarCompra.classList.add('hidden')

//             return;
//         };
//         const carrinho = JSON.parse(localStorage.carrinho);
//         let totalCarrinho = 0;

       
//         carrinho.map((e, index) => {
//             totalCarrinho = totalCarrinho + e.qtdProduto * e.preco;
//             lista += `
//             <li class=" text-left bg-gray-50 my-2 text-sm p-5 relative shadow-sm">
//                 <p><b>Produto:</b> ${e.nome}</p>
//                 <hr class="my-2">
//                 <p><b>Quantidade:</b> ${e.quantidade}</p>
//                 <p><b>Valor:</b> <span class=" font-semibold">R$${e.preco.replace('.', ',')}</span></p>
//                 <p><b>Total:</b> <span class="text-green-600 text-xl font-semibold">R$${Number(e.preco * e.qtdProduto).toFixed(2)}</span> x <span class="text-green-600 text-xl font-semibold">${e.qtdProduto}</span></p>
//                 <button onclick="carrinho.remover(${e.variante_id})" class=" ml-auto block absolute right-4 bottom-2">
//                     <i class="bi bi-trash2-fill text-red-400 text-3xl"></i>
//                 </button>
//             </li>
//             `
//         });

//         listaProdutosCarrinho.innerHTML = lista
//         subtotal.innerText = `R$${String(Number(totalCarrinho).toFixed(2)).replace('.', ',')}`
//         btnFinalizarCompra.classList.remove('hidden')

//     };
//     remover(variante_id){
//         const carrinho = JSON.parse(localStorage.carrinho);    
//         const carrinhoAtualizado = carrinho.filter(e => e.variante_id != variante_id);
//         localStorage.carrinho = JSON.stringify(carrinhoAtualizado);
//         this.atualizarProdutos()
//     };
//     abrir(){
//         this.atualizarProdutos()
//         carrinhoComponent.classList.remove('hidden')
//         setTimeout(() => {
//             carrinhoComponent.classList.replace('left-[-100%]', 'left-0')
//         }, 30);
//     };
//     fechar(){
    
//         carrinhoComponent.classList.add('left-[-100%]')
//         setTimeout(() => {
//             carrinhoComponent.classList.add('hidden')
//         }, 300);
//     };
//     setCookie(name, value, days) {
//         if (typeof name !== 'string' || typeof days !== 'number' || days <= 0) {
//             console.error('Parâmetros inválidos para setCookie.');
//             return;
//         }
//         if(typeof value !== 'string'){
//             value = JSON.stringify(value);
//         };

//         const expires = new Date();
//         expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//         document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
//         return {
//             msg: 'Item salvo em Cookies',
//             name: name, 
//             value: value
//         }
//     };
//     finalizarCompra(){
//         if(!localStorage.carrinho || localStorage.carrinho == '[]'){
//             alert('Seu carrinho está vazio!')
//         };
          
//         const carrinho = JSON.parse(localStorage.carrinho);
//         const cookie = [];
//         carrinho.forEach(e => {
//             cookie.push({
//                 produto_id: e.produto_id, 
//                 variante_id: e.variante_id, 
//                 qtdProduto: e.qtdProduto
//             });
//         });

//         console.log(cookie)
//         this.setCookie('carrinho', cookie, 30);
        
//         window.location.href = '/checkout';
//     };
// }


// const carrinho = new Carrinho()
// carrinho.alertaQTD()


class Cookies {
    constructor(name, days){
        this.name = name;
        this.days = days;
    }

    set(value) {
        if (typeof this.name !== 'string'  || typeof this.days !== 'number' || this.days <= 0) {
            console.error('Parâmetros inválidos para setCookie.');
            return;
        }
        if(typeof value !== 'string'){
            value = JSON.stringify(value)
        }
        const expires = new Date();
        expires.setTime(expires.getTime() + this.days * 24 * 60 * 60 * 1000);
        document.cookie = `${this.name}=${value}; expires=${expires.toUTCString()}; path=/`;
        return {
            msg: 'Item salvo em Cookies',
            name: this.name, 
            value: value
        }
    }

    get() {
        if (typeof this.name !== 'string') {
            console.error('Parâmetro inválido para getCookie.');
            return null;
        }
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const cookie = cookies.find(cookie => cookie.startsWith(`${this.name}=`));
        return cookie ? cookie.substring(this.name.length + 1) : null;
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




class Carrinho {
    #cookie = new Cookies('carrinho', 30)

    adicioar(item){
        // Verificar item
        if(typeof item != 'object') return console.log('Item a ser adicionado não e um objeto!')

        // Instanciar carrinho
        const carrinho = JSON.parse(this.#cookie.get('carrinho'))

        //Incrementar item
        carrinho.push(item)

        //Salvar no cookie
        this.#cookie.set(carrinho)

        console.log(this.#cookie.get())
        this.#cookie.removeItem(2)
       
    }

    get (){
        return JSON.parse(this.#cookie.get('carrinho'));

    }
}

const carrinho = new Carrinho();
carrinho.adicioar({
    nome: 'teste'
})
