function carregarIndicadorCarrinho(){
    const itensNoCarrinho = document.getElementById('itensNoCarrinho')
    if(localStorage.carrinho && localStorage.carrinho != '[]'){
        const carrinho = JSON.parse(localStorage.carrinho)
        const qtd = carrinho.length
        itensNoCarrinho.innerText = qtd
        itensNoCarrinho.classList.replace('hidden', 'flex')
    }else{
        itensNoCarrinho.classList.replace('flex','hidden')
    }
}
carregarIndicadorCarrinho()