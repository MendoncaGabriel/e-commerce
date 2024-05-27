const inputQtd = document.querySelector('#inputQtd');
const variantesSelect = document.querySelector('#variantesSelect');
const preco = document.querySelector('#preco');

var produtoSelecionado = {qtd: 1};

//BUSCAR ITEM SELECIONADO EM SELECT
variantesSelect.addEventListener('change', () => {
    const option = variantesSelect.options[variantesSelect.selectedIndex]
    const preco = Number(option.getAttribute('preco'));
    const estoque = Number(option.getAttribute('estoque'));
    const variante_id = Number(option.getAttribute('variante_id'));
    const produto_id = Number(option.getAttribute('produto_id'));
    const nome = option.getAttribute('nome');
    const imagem = option.getAttribute('imagem');

    document.querySelector('#preco').innerHTML = converterEmReal(preco);
    produtoSelecionado.qtd = 1
    produtoSelecionado.estoque = estoque
    produtoSelecionado.preco = preco
    produtoSelecionado.variante_id = variante_id || null
    produtoSelecionado.produto_id = produto_id
    produtoSelecionado.nome = nome
    produtoSelecionado.imagem = imagem

    // quando talterar de option começa do 1
    inputQtd.value = 1
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
   
        return false
    };

    return true
};

//MAIS E MENOS  
function maisQtd(){
    if(verificarItemSelecionado() == false)  return ;
    if(produtoSelecionado.estoque > produtoSelecionado.qtd){
        produtoSelecionado.qtd++;
        preco.innerHTML = converterEmReal(Number(produtoSelecionado.preco) * Number(produtoSelecionado.qtd));
        inputQtd.value = produtoSelecionado.qtd
    }
}
function menosQtd(){
    if(verificarItemSelecionado() == false)  return ;
    if(produtoSelecionado.qtd > 1){
        produtoSelecionado.qtd--
        preco.innerHTML = converterEmReal(Number(produtoSelecionado.preco) * Number(produtoSelecionado.qtd));
        inputQtd.value = produtoSelecionado.qtd
    }

}




function finalizarCompraProduto(){
    if(verificarItemSelecionado() == false)  return ;


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

    //passar para o cookies
    const itens = []
    const carrinho = JSON.parse(localStorage.carrinho);
    carrinho.forEach(e => {
        itens.push({produto_id: e.produto_id, qtd: e.qtd, variante_id: e.variante_id})
    })
    setCookie("carrinho", JSON.stringify(itens), 30)

    window.location.href = '/checkout'
}

function adicionarAoCarrinho(){
    if(verificarItemSelecionado() == false)  return ;

    if(!localStorage.carrinho || localStorage.carrinho == '[]'){
        console.log("item adicionado ao carrinho ")
        console.log(produtoSelecionado)
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
