const qtdCarrinho = document.getElementById('qtdCarrinho');
const qtdCarrinhoContainer = document.getElementById('qtdCarrinhoContainer');

function notificarItemCarrinho(){
    if(localStorage.carrinho){
        const carrinho = JSON.parse(localStorage.carrinho);
        if(carrinho.length > 0){
            qtdCarrinhoContainer.classList.replace('hidden', 'flex');
            qtdCarrinho.innerText = carrinho.length;
        }else{
            qtdCarrinhoContainer.classList.replace('flex', 'hidden');
        }
    }else{
        qtdCarrinhoContainer.classList.replace('flex', 'hidden');
    }
};notificarItemCarrinho();