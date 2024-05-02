const quantidadeProduto = document.querySelector('#quantidadeProduto');
const variantesSelect = document.querySelector('#variantesSelect');
const preco = document.querySelector('#preco');

class Produto {
    constructor(){
       this.produto = {};
       this.precoUnit = 0;
    };

    get getProduto(){
        return this.produto;
    }
    set setProduto(array){
        this.produto = array;
    }

    calcularCusto(){
        let totalProduto = this.produto.preco * this.produto.qtdProduto
        preco.innerHTML = `R$ ${totalProduto.toFixed(2).replace('.', ',')}`;
    };

    maisQTD(){
        if(this.alertaSelecioneVariante() == false) return;
        
        if(this.produto.estoque > this.produto.qtdProduto){
            this.produto.qtdProduto = this.produto.qtdProduto +1;
        };
        this.calcularCusto()
        quantidadeProduto.value = this.produto.qtdProduto
    };

    menosQTD(){
        if(this.alertaSelecioneVariante() == false) return;
        if(this.produto.qtdProduto > 1){
            this.produto.qtdProduto = this.produto.qtdProduto -1;
        };
        this.calcularCusto()
        quantidadeProduto.value = this.produto.qtdProduto
    };

    setCookie(name, value, days) {
        if (typeof name !== 'string' || typeof days !== 'number' || days <= 0) {
            console.error('Parâmetros inválidos para setCookie.');
            return;
        }
        if(typeof value !== 'string'){
            value = JSON.stringify(value);
        };

        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
        return {
            msg: 'Item salvo em Cookies',
            name: name, 
            value: value
        }
    };

    finalizarCompra(){
        if(this.alertaSelecioneVariante() == false) return;

        if(!localStorage.carrinho || localStorage.carrinho != '[]'){
            localStorage.carrinho = JSON.stringify([this.produto]);
        }else{
            const produtosNoCarrinho = JSON.parse(localStorage.carrinho);
            produtosNoCarrinho.push(this.produto);
            localStorage.carrinho = JSON.stringify(produtosNoCarrinho);
        };

        const carrinho = JSON.parse(localStorage.carrinho);
        const cookie = [];
        carrinho.forEach(e => {
            cookie.push({
                produto_id: e.produto_id, 
                variante_id: e.variante_id, 
                qtdProduto: e.qtdProduto
            });
        });


        this.setCookie('carrinho', cookie, 30);

        window.location.href = '/checkout';
    };

    alertaSelecioneVariante(){
        if(!variantesSelect.value || variantesSelect.value == ''){
            alert('Escolha uma das opções');
            variantesSelect.classList.replace('border-blue-500', 'border-red-500')
            setTimeout(() => {
                variantesSelect.classList.replace('border-red-500', 'border-blue-500')
            }, 1000);
            return false;
        };
    };


    adicionarAoCarrinho(){
        if(this.alertaSelecioneVariante() == false) return;
        
        //pegar produtodo carrinho
        console.log(window.carrinho)

        //pegar produto a ser adicionado
        const produtoSelecionado = {
            idVariante: variantesSelect.value,
            qtdProduto: quantidadeProduto.value
        }

        console.log(produtoSelecionado)

        
    }
};


const produto = new Produto();




variantesSelect.addEventListener('change', (e)=>{  
    const variante_id = variantesSelect.value;
    quantidadeProduto.value = 1;

    if(localStorage.paginaProduto && localStorage.paginaProduto != "[]"){
        const produtoLocalStorage = JSON.parse(localStorage.paginaProduto);
        
        produtoLocalStorage.forEach(element => {
            console.log(element)
            if(element.variante_id == variante_id){
                element.qtdProduto = 1;
                produto.setProduto = element;
                preco.innerHTML = `R$ ${Number(element.preco).toFixed(2).replace('.', ',')}`;
            };
        });
    };

    console.log('===> variante escolhida: ', produto.getProduto)

})
