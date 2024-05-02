const shadowModal = document.getElementById('shadowModal');
const modalComponent = document.getElementById('modal');
const nomeModal = document.getElementById('nomeModal');
const imagemModal = document.getElementById('imagemModal');
const quantidade = document.getElementById('quantidade');
const valorModal = document.getElementById('valorModal');
const totalModal = document.getElementById('totalModal');


notificarItemCarrinho()

//ULTILITARIOS
function converterEmReal(precoString){
    const precoNumero = parseFloat(precoString);

    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return formatoMoeda.format(precoNumero);
};
function atualizarTotalModal(){
    totalModal.innerText = 'Total: ' +  converterEmReal(Number(window.modalItem.preco) * Number(quantidade.value));
    window.modalItem.qtd = Number(quantidade.value);
    notificarItemCarrinho()
};

//ABRIR E FECHAR
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

//CARREGAR MODAL
function carregarItemModal(data){
    window.modalItem = JSON.parse(data);

    //se item ja estiver no carrinho, atualiza o modal com suas informações
    let resetarValoresInput = true;
    if(localStorage.carrinho){
        const carrinho = JSON.parse(localStorage.carrinho);
        carrinho.forEach(e => {
            if(e.variante_id == window.modalItem.variante_id){
                quantidade.value = e.qtd;
                window.modalItem.qtd = e.qtd;
                resetarValoresInput = false;
            };
        })
    }

    //se não reset o mocal q quantidade
    if(resetarValoresInput){
        quantidade.value = 1;
        window.modalItem.qtd = 1;
    }

    imagemModal.src = '/img/' + window.modalItem.imagem;
    nomeModal.innerText = window.modalItem.nome;
    valorModal.innerText = 'Valor: ' +  converterEmReal(window.modalItem.preco);
    totalModal.innerText = 'Total: ' +  converterEmReal(Number(window.modalItem.preco) * Number(quantidade.value));
};

//MUDAR QUANTIDADE MODAL
function maisQtd(){
   if(quantidade.value < window.modalItem.estoque) quantidade.value++;  atualizarTotalModal();
};
function menosQtd(){
    if(quantidade.value > 1) quantidade.value--; atualizarTotalModal();
};

//ADICIONAR AO CARRINHO
function adicionarAoCarrinho(){
    if(!localStorage.carrinho){
        localStorage.carrinho = JSON.stringify([window.modalItem]);
    }else{
        const carrinho = JSON.parse(localStorage.carrinho);
        let pushNoCarrinho = true;

        //se item ja estiver no carrinho atualizar
        carrinho.forEach(e => {
            if(e.variante_id == window.modalItem.variante_id){
                pushNoCarrinho = false;
                e.qtd = window.modalItem.qtd;
            };
        });
        //se não estiver no carrinho, adicionar
        if(pushNoCarrinho){
            carrinho.push(window.modalItem);
        };
        localStorage.carrinho = JSON.stringify(carrinho);
    };
    fecharModal();
    notificarItemCarrinho()
    
}