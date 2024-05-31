//ULTILITARIOS--------------------------
function converterEmReal(precoString){
    const precoNumero = parseFloat(precoString);
    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return formatoMoeda.format(precoNumero);
};
function atualizarTotalModal(){
    totalModal.innerText = 'Total: ' +  converterEmReal(Number(itemSelected.preco) * Number(quantidade.value));
    itemSelected.qtd = Number(quantidade.value);
    notificarItemCarrinho()
};


var itemSelected = {};


class AbrirFechar {
    constructor() {
        this.btnOpenModal = document.querySelectorAll('.btnOpenModal');
        this.btnCloseModal = document.getElementById('btnCloseModal');
        this.shadowModal = document.getElementById('shadowModal');
        this.modal = document.getElementById('modal');

        if (this.btnOpenModal && this.shadowModal && this.modal) {
            this.btnOpenModal.forEach(e => e.addEventListener('click', () => this.abrir())) //tem varios por isso classe
            this.btnCloseModal.addEventListener('click', () => this.fechar()) //so tem um por isso id
        }
    }

    abrir() {
        this.shadowModal.classList.replace('hidden', 'block');
        this.modal.classList.replace('hidden', 'block');
        setTimeout(() => this.modal.classList.replace('top-[150%]', 'top-1/2'), 50);
    }
    fechar(){
        this.modal.classList.replace('top-1/2', 'top-[150%]')
        setTimeout(()=>{
            this.shadowModal.classList.replace( 'block', 'hidden');
            this.shadowModal.classList.replace('block', 'hidden');
        }, 250)
    }
}
class Load{
    constructor(){
        this.btnOpenModal = document.querySelectorAll('.btnOpenModal')
        this.imagemModal = document.getElementById('imagemModal')
        this.quantidade = document.getElementById('quantidade')
        this.nomeModal = document.getElementById('nomeModal')
        this.valorModal = document.getElementById('valorModal')
        this.totalModal = document.getElementById('totalModal')

        if(this.btnOpenModal){
            this.btnOpenModal.forEach(item => item.addEventListener('click', () => this.fill(item)));
        }
    }

    load(item) { // Carregar e preencher o formulário
        const itemData = {
            variante_id: item.getAttribute('variante_id'),
            produto_id: item.getAttribute('produto_id'),
            quantidade: item.getAttribute('quantidade'),
            estoque: item.getAttribute('estoque'),
            imagem: item.getAttribute('imagem'),
            preco: item.getAttribute('preco'),
            nome: item.getAttribute('nome'),
            qtd: 1
        };

        itemSelected = itemData; // Definindo itemSelected como uma propriedade da classe
        console.log(itemSelected)
        return itemData;
    }

    updateCard(item) {
        // Se item já estiver no carrinho, atualiza o modal com suas informações
        let resetarValoresInput = true;
        if (localStorage.carrinho) {
            const carrinho = JSON.parse(localStorage.carrinho);
            carrinho.forEach(e => {
                if (e.variante_id == item.variante_id) {
                    this.quantidade.value = e.qtd;
                    item.qtd = e.qtd;
                    resetarValoresInput = false;
                }
            });
        }

        // Se não, reseta o modal com quantidade 1
        if (resetarValoresInput) {
            this.quantidade.value = 1;
            item.qtd = 1;
        }
    }

    fill(item) {
        const itemData = this.load(item);
        this.updateCard(itemData);

        // Preenche o modal
        this.nomeModal.innerText = itemData.nome;
        this.imagemModal.src = '/img/' + itemData.imagem;
        this.valorModal.innerText = 'Valor: ' + converterEmReal(itemData.preco);
        this.totalModal.innerText = 'Total: ' + converterEmReal(Number(itemData.preco) * Number(this.quantidade.value));
    }

}
class Controle{
    constructor(){
        this.btnMaisQtd = document.getElementById('btnMaisQtd')
        this.btnMenosQtd = document.getElementById('btnMenosQtd')
        this.quantidade = document.getElementById('quantidade')

        if(this.btnMaisQtd && this.btnMenosQtd && this.quantidade){
            this.btnMaisQtd.addEventListener('click', () => this.maisQtd())
            this.btnMenosQtd.addEventListener('click', () => this.menosQtd())
        }
    }
    maisQtd(){
        if(Number(this.quantidade.value) < Number(itemSelected.estoque) || 0){
            quantidade.value++;  
            atualizarTotalModal();
        };
    };
    menosQtd(){
        if(Number(this.quantidade.value) > 1){
            quantidade.value--; 
            atualizarTotalModal();
        }
    };
}
class Buttons {
    constructor(abrirFechar){
        this.abrirFechar = abrirFechar
        this.finishBuy = document.getElementById('finishBuy')
        this.btnAddcard = document.getElementById('btnAddcard')
        
        if(this.btnAddcard) {btnAddcard.addEventListener('click', () => this.addCard())};

        if(this.finishBuy) {finishBuy.addEventListener('click', () => this.finalizarCompra())};
        
    }
    addCard (){
        if(!localStorage.carrinho){
            localStorage.carrinho = JSON.stringify([itemSelected]);
        }else{
            const carrinho = JSON.parse(localStorage.carrinho);
            let pushNoCarrinho = true;
            
            //se item ja estiver no carrinho atualizar
            carrinho.forEach(e => {
                if(e.variante_id == itemSelected.variante_id){
                    pushNoCarrinho = false;
                    e.qtd = itemSelected.qtd;
                };
            });
            
            //se não estiver no carrinho, adicionar
            if(pushNoCarrinho){
                carrinho.push(itemSelected);
            };
            localStorage.carrinho = JSON.stringify(carrinho);
        };
        this.abrirFechar.fechar()
        notificarItemCarrinho()
        
        // rolar a tela ate o topo
        window.scrollTo({top: 0, behavior: 'smooth'
    });
    
    setTimeout(() => abrirCarrinho(), 400);
    }

    finalizarCompra(){
        console.log('finalizando')
        function setCookie(name, value, days) {
            if (typeof name !== 'string' || typeof value !== 'string' || typeof days !== 'number' || days <= 0) {
                console.error('Parâmetros inválidos para setCookie.');
                return;
            }
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
            return {
                msg: 'Item salvo em Cookies',
                name: name, 
                value: value
                }
        }
        this.addCard()
        const itens = []
        const carrinho = JSON.parse(localStorage.carrinho);
        carrinho.forEach(e => {
            itens.push({produto_id: e.produto_id, qtd: e.qtd, variante_id: e.variante_id})
        })
        setCookie("carrinho", JSON.stringify(itens), 30)
        window.location.href = "/checkout"
    }
}

class Modal {
    constructor() {
        const load = new Load()
        const abrirFechar = new AbrirFechar()
        const controle = new Controle()
        const buttons = new Buttons(abrirFechar)
    }
}
const modal = new Modal()





notificarItemCarrinho()