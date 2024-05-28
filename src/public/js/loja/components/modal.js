const shadowModal = document.getElementById('shadowModal');
const imagemModal = document.getElementById('imagemModal');
const quantidade = document.getElementById('quantidade');
const valorModal = document.getElementById('valorModal');
const totalModal = document.getElementById('totalModal');
const nomeModal = document.getElementById('nomeModal');
const modalComponent = document.getElementById('modal');
let itemSelecionado = {};




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
    totalModal.innerText = 'Total: ' +  converterEmReal(Number(itemSelecionado.preco) * Number(quantidade.value));
    itemSelecionado.qtd = Number(quantidade.value);
    notificarItemCarrinho()
};

//ABRIR E FECHAR------------------------
function abrirModal(){
shadowModal.classList.replace('hidden', 'block');
modalComponent.classList.replace('hidden', 'block');
setTimeout(()=> modalComponent.classList.replace('top-[150%]', 'top-1/2'), 50)
};
function fecharModal(){
modalComponent.classList.replace('top-1/2', 'top-[150%]')
setTimeout(()=>{
        shadowModal.classList.replace( 'block', 'hidden');
        modalComponent.classList.replace('block', 'hidden');
}, 250)
};

//CARREGAR MODAL------------------------
function carregarItemModal(element) {
    const data = {
        nome: element.getAttribute('nome'),
        preco: element.getAttribute('preco'),
        variante_id: element.getAttribute('variante_id'),
        produto_id: element.getAttribute('produto_id'),
        imagem: element.getAttribute('imagem'),
        estoque: element.getAttribute('estoque'),
        qtd: 1
    };
    itemSelecionado = data;


    // Se item já estiver no carrinho, atualiza o modal com suas informações
    let resetarValoresInput = true;
    if(localStorage.carrinho){
        const carrinho = JSON.parse(localStorage.carrinho);
        carrinho.forEach(e => {
            if(e.variante_id == itemSelecionado.variante_id){
                quantidade.value = e.qtd;
                itemSelecionado.qtd = e.qtd;
                resetarValoresInput = false;
            };
        });
    }

    // Se não, reseta o modal com quantidade 1
    if(resetarValoresInput){
        quantidade.value = 1;
        itemSelecionado.qtd = 1;
    }

    imagemModal.src = '/img/' + itemSelecionado.imagem;
    nomeModal.innerText = itemSelecionado.nome;
    valorModal.innerText = 'Valor: ' + converterEmReal(itemSelecionado.preco);
    totalModal.innerText = 'Total: ' + converterEmReal(Number(itemSelecionado.preco) * Number(quantidade.value));
};

//MUDAR QUANTIDADE MODAL----------------
function maisQtd(){
    if(Number(quantidade.value) < Number(itemSelecionado.estoque)){
        quantidade.value++;  
        atualizarTotalModal();
    };
};
function menosQtd(){
    if(Number(quantidade.value) > 1){
        quantidade.value--; 
        atualizarTotalModal();
    }
};

//BOTÕES-------------------------------
function adicionarAoCarrinho(){
    if(!localStorage.carrinho){
        localStorage.carrinho = JSON.stringify([itemSelecionado]);
    }else{
        const carrinho = JSON.parse(localStorage.carrinho);
        let pushNoCarrinho = true;

        //se item ja estiver no carrinho atualizar
        carrinho.forEach(e => {
            if(e.variante_id == itemSelecionado.variante_id){
                pushNoCarrinho = false;
                e.qtd = itemSelecionado.qtd;
            };
        });
        //se não estiver no carrinho, adicionar
        if(pushNoCarrinho){
            carrinho.push(itemSelecionado);
        };
        localStorage.carrinho = JSON.stringify(carrinho);
    };
    fecharModal();
    notificarItemCarrinho()

    // rolar a tela ate o topo
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // 
    setTimeout(() => {
        abrirCarrinho();
    }, 400);
    
};
function finalizarCompra(){
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
    adicionarAoCarrinho()
    const itens = []
    const carrinho = JSON.parse(localStorage.carrinho);
    carrinho.forEach(e => {
        itens.push({produto_id: e.produto_id, qtd: e.qtd, variante_id: e.variante_id})
    })
    setCookie("carrinho", JSON.stringify(itens), 30)

    window.location.href = "/checkout"

};



notificarItemCarrinho()