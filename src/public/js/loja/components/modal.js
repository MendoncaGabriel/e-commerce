const modalComponent = document.getElementById('modal')
const modalContainer = document.getElementById('modalContainer')
const shadowModal = document.getElementById('shadowModal')
const quantidade = document.getElementById('quantidade')
const imagemModal = document.getElementById('imagemModal')
const nomeModal = document.getElementById('nomeModal')
const valorModal = document.getElementById('valorModal')
const totalModal = document.getElementById('totalModal')

class Modal {
    constructor(){
        this.produtos = JSON.parse(localStorage.produtos);
        this.produto = {};
    };
    atualizarCompos(){
        imagemModal.src = '/img/'+ this.produto.imagem;
        nomeModal.innerText = this.produto.nome;
        quantidade.value = this.produto.qtdProduto ?? 1;
        valorModal.innerHTML = '<b>Valor:</b> R$' + this.produto.preco.replace('.', ',');
        let total = Number(this.produto.preco) * Number(this.produto.qtdProduto ?? 1);
        let totalEmMoeda = String(total.toFixed(2)).replace('.', ',');
        totalModal.innerHTML = '<b>Total:</b> R$' + totalEmMoeda;
    };
    abrir(id){
        // salvando produto do modal
        this.produto = this.produtos.find(e =>  e.variante_id == id);
        if(!this.produto.qtdProduto && this.produto.estoque > 0) this.produto.qtdProduto = 1;
        this.atualizarCompos();

        // animação de abertura
        modalContainer.classList.remove('hidden');
        shadowModal.classList.remove('hidden');
        modalComponent.classList.remove('hidden');
        setTimeout(() => {
            modalComponent.classList.replace('translate-y-full', '-translate-y-1/2');
        }, 10);
    };
    fechar(){
        modalComponent.classList.replace('-translate-y-1/2', 'translate-y-full');
        setTimeout(() => {
            modalComponent.classList.add('hidden');
            modalContainer.classList.add('hidden');
            shadowModal.classList.add('hidden');
        }, 200);
    };
    maisQtd(){
        // criar um incremento para considerar o que ja esta no carrinho
        let incremento = 0;
        if(localStorage.carrinho){
            const carrinho = JSON.parse(localStorage.carrinho) ?? [];
            const produto = carrinho.find(e => e.variante_id == this.produto.variante_id) ?? {};
            incremento = produto.qtdProduto ?? 0;
        };
  

        // aqui eu limito a quantidade maxima para respeitar o estoque
        !this.produto.qtdProduto ? this.produto.qtdProduto = 1: '';
        if((this.produto.qtdProduto + incremento ) <  this.produto.estoque){
            this.produto.qtdProduto = this.produto.qtdProduto + 1 ;
            this.atualizarCompos();
        };
    };
    menosQtd(){
        //aqui temos uma pequena validação para qtdProduto nao for menor ou igual a 0
        if(this.produto.qtdProduto > 1){
            this.produto.qtdProduto = this.produto.qtdProduto - 1;
        };
        this.atualizarCompos();
    };
    alertaQTD(){
        if(localStorage.carrinho && localStorage.carrinho != '[]'){
            const carrinho = JSON.parse(localStorage.carrinho);
            const qtd = carrinho.length;
            itensNoCarrinho.innerText = qtd;
            itensNoCarrinho.classList.replace('hidden', 'flex');
        }else{
            itensNoCarrinho.classList.replace('flex','hidden');
        };
    };
    adicionarAoCarrinho(){
        if(!localStorage.carrinho || localStorage.carrinho == '[]' ){
            localStorage.carrinho = JSON.stringify([this.produto]); 
            this.alertaQTD();
            this.fechar();
            return 
        };

        const carrinho = JSON.parse(localStorage.carrinho);
    
        carrinho.forEach(element => {
            if(element.produto_id == this.produto.produto_id && element.variante_id == this.produto.variante_id){
                console.log('produto ja esta no carrinho');

                // antes de incrementar verifica se a quantidade que ja esta no carrinho somado com o novo acrecimo e menor que o estoque
                if((element.qtdProduto + this.produto.qtdProduto) < element.estoque){
                    element.qtdProduto = element.qtdProduto + this.produto.qtdProduto
                    console.log('adicionando qtd')
                }else{
                    // se não for seta a quantidade para o valor maximo igual o estoque
                    element.qtdProduto = element.estoque;
                    console.log('setando estoque maximo');
                    alert('Todo estoque disponivel ja esta no seu carrinho!');
                };

            }else{
                carrinho.push(this.produto);
            };
        });


        localStorage.carrinho = JSON.stringify(carrinho);
        this.alertaQTD();
        this.fechar();
    };
    finalizarCompra(){
        console.log(this.produto)

        if(!localStorage.carrinho || localStorage.carrinho){
            localStorage.carrinho = JSON.stringify([this.produto]);
        }else{
            const carrinho = JSON.parse(localStorage.carrinho);
            carrinho.push(this.produto);
            localStorage.carrinho = JSON.stringify(carrinho);
        };
        this.adicionarAoCarrinho();
        this.fechar();
        const abrirCarrinho = new Carrinho()
        abrirCarrinho.abrir()


        return
        if(!localStorage.carrinho || localStorage.carrinho == '[]'){
            alert('Seu carrinho está vazio!')
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

        console.log(cookie)
        this.setCookie('carrinho', cookie, 30);
        
        window.location.href = '/checkout';
    };
}
const modal = new Modal();