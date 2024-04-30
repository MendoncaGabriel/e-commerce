const modalComponent = document.getElementById('modal')
const shadowModal = document.getElementById('shadowModal')
const quantidade = document.getElementById('quantidade')
const imagemModal = document.getElementById('imagemModal')
const nomeModal = document.getElementById('nomeModal')
const valorModal = document.getElementById('valorModal')
const totalModal = document.getElementById('totalModal')

class ControlesModal {
    constructor(){
        this.modal = [];
    }
    async abrir(vaivariante_id){
        //buscar dados da variante
        const response = await axios.get('/api/variante/' + vaivariante_id );
        const variante = response.data.result;
        this.carregar(variante[0]);

        shadowModal.classList.replace('hidden', 'flex')
        modalComponent.classList.replace('hidden', 'fixed')
        setTimeout(() => {
            modalComponent.classList.replace('top-[150%]', 'top-1/2')
        }, 10);
    }
    fechar(){
        modalComponent.classList.replace('top-1/2', 'top-[150%]')
        setTimeout(() => {
            shadowModal.classList.replace('flex', 'hidden')
            modalComponent.classList.replace('fixed', 'hidden')
        }, 200);
    }
    carregar(data){
        this.modal = data;
        imagemModal.src ='/img/' + data.imagem
        valorModal.innerText = 'Valor: R$'+ data.preco
        totalModal.innerText = 'Total: R$'+ data.preco
    }
    atualizar(){
        quantidade.value = this.modal.qtd
        let total = this.modal.qtd * this.modal.preco
        totalModal.innerText = 'Total: R$'+ total
    }
    maisQtd(){
        if(!this.modal.qtd){
            this.modal.qtd = 2;
        }else if(this.modal.estoque > this.modal.qtd){
            this.modal.qtd++;
        };
        this.atualizar()
    }
    menosQtd(){
        if(!this.modal.qtd){
            this.modal.qtd = 1;
        }else if(this.modal.qtd > 1){
            this.modal.qtd--
        };
        this.atualizar()
    }
}
class Modal extends ControlesModal{
    async adicionarAoCarrinho(){
        const id = this.modal.variante_id;
        const carrinho = window.carrinho.get();
        console.log('===> carrinho:', carrinho)

        if(carrinho){
            console.log('Temitem no carrinho')
            //verifixar se item esta no carrinho
            const index = carrinho.findIndex(e => e.variante_id == id)
            //item ja esta no carrinho, incrementar
            if(index){
                console.log('item ja esta no carrinho, incrementar')
                if((carrinho[index].qtd + this.modal.qtd) <= this.modal.estoque){
                    //verificar se e possivel adicionar, qtd menor igual a estoque
                    carrinho[index].qtd = (carrinho[index].qtd + this.modal.qtd)
                    //salvar
                    window.carrinho.set(carrinho);
                }else{
                    alert('Carrinho Cheio!')
                }
            }
            
        }else{
            //item não esta no carrinho, adicionar
            console.log('item não esta no carrinho, adicionar')
            if(!this.modal.qtd) this.modal.qtd = 1;
            window.carrinho.set(this.modal)
            this.modal = [];
            this.fechar()
        }

    }
}
window.modal = new Modal

