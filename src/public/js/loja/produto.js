const quantidadeProduto = document.querySelector('#quantidadeProduto');
const variantesSelect = document.querySelector('#variantesSelect');
const preco = document.querySelector('#preco');

//PRODUTOS E VARIANTES 
let produtoPagina = [];
if(localStorage.paginaProduto){
    produtoPagina = JSON.parse(localStorage.paginaProduto);
};


//SE NÃO TIVER VARIANTES O ITEM SELECIONADO E O 0
let produtoSelecionado = {};
if(produtoPagina.length == 1){
    produtoSelecionado = produtoPagina[0]
    produtoSelecionado.qtd = 1;
}


//BUSCAR ITEM SELECIONADO EM SELECT
variantesSelect.addEventListener('change', () => {
    const variante_id = variantesSelect.value;
    const item = produtoPagina.filter(e => e.variante_id == variante_id)[0];
    item.qtd = 1
    produtoSelecionado = item;
    preco.innerHTML = converterEmReal(Number(produtoSelecionado.preco));
    quantidadeProduto.value = 1;

    console.log(produtoSelecionado)
})


//ULTILITARIOS
function converterEmReal(precoString){
    const precoNumero = parseFloat(precoString);

    const formatoMoeda = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return formatoMoeda.format(precoNumero);
};


//CONTROLES
function verificarItemSelecionado(){
    const select = variantesSelect.value;
    if(!select || select == '') {
        alert('Por favor, selecione uma opção!'); 
        variantesSelect.classList.replace('border-c1', 'border-red-500');
        variantesSelect.classList.replace('border-2', 'border-4');

        setTimeout(()=> {
            variantesSelect.classList.replace('border-red-500', 'border-c1');
            variantesSelect.classList.replace('border-4', 'border-2' );
        }, 1000);
   
        return;
    };
};


function maisQtd(){
    verificarItemSelecionado();
    console.log('###')


    console.log(produtoSelecionado.estoque, produtoSelecionado.qtd)

    if(produtoSelecionado.estoque > produtoSelecionado.qtd){
        produtoSelecionado.qtd++;
        quantidadeProduto.value = produtoSelecionado.qtd;
        preco.innerHTML = converterEmReal(Number(produtoSelecionado.preco) * Number(produtoSelecionado.qtd));

    }
}
function menosQtd(){
    verificarItemSelecionado();
    
    if(produtoSelecionado.qtd > 1){
        produtoSelecionado.qtd--
        quantidadeProduto.value = produtoSelecionado.qtd;
        preco.innerHTML = converterEmReal(Number(produtoSelecionado.preco) * Number(produtoSelecionado.qtd));
    }

}

function finalizarCompra(){
    verificarItemSelecionado();
    if(!localStorage.carrinho){
        localStorage.carrinho = JSON.stringify([produtoSelecionado]);
    }else{
        const carrinho = JSON.parse(localStorage.carrinho);
        let pushNoCarrinho = true;

        //se item ja estiver no carrinho atualizar
        carrinho.forEach(e => {
            if(e.variante_id == produtoSelecionado.variante_id){
                pushNoCarrinho = false;
                e.qtd = produtoSelecionado.qtd;
            };
        });
        //se não estiver no carrinho, adicionar
        if(pushNoCarrinho){
            carrinho.push(produtoSelecionado);
        };
        localStorage.carrinho = JSON.stringify(carrinho);
    };

    notificarItemCarrinho();
    window.location.href = '/checkout'
}

function adicionarAoCarrinho(){
    verificarItemSelecionado();


    if(!localStorage.carrinho){
        localStorage.carrinho = JSON.stringify([produtoSelecionado]);
    }else{
        const carrinho = JSON.parse(localStorage.carrinho);
        let pushNoCarrinho = true;

        //se item ja estiver no carrinho atualizar
        carrinho.forEach(e => {
            if(e.variante_id == produtoSelecionado.variante_id){
                pushNoCarrinho = false;
                e.qtd = produtoSelecionado.qtd;
            };
        });
        //se não estiver no carrinho, adicionar
        if(pushNoCarrinho){
            carrinho.push(produtoSelecionado);
        };
        localStorage.carrinho = JSON.stringify(carrinho);
    };

    notificarItemCarrinho();
    abrirCarrinho();
        
}

