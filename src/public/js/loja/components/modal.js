const modal = document.getElementById('modal')
const modalContainer = document.getElementById('modalContainer')
const shadowModal = document.getElementById('shadowModal')
const quantidade = document.getElementById('quantidade')
const imagemModal = document.getElementById('imagemModal')
const nomeModal = document.getElementById('nomeModal')
const valorModal = document.getElementById('valorModal')
const totalModal = document.getElementById('totalModal')


const Modal = {
    item: {},
    abrir: (data) => {
        const obj = JSON.parse(data)
        obj.qtdProduto = 1
        Modal.item = obj
        Modal.carregar()
        modalContainer.classList.remove('hidden')
        shadowModal.classList.remove('hidden')
        modal.classList.remove('hidden')
        setTimeout(() => {
            modal.classList.replace('translate-y-full', '-translate-y-1/2')
        }, 10);
    },
    fechar: () => {
        modal.classList.replace('-translate-y-1/2', 'translate-y-full')

        setTimeout(() => {
            modal.classList.add('hidden')
            modalContainer.classList.add('hidden')
            shadowModal.classList.add('hidden')
        }, 200);
            
        // reset do modal
        item = {}
        quantidade.value = 1
    },
    carregar: () =>{
        imagemModal.src = '/img/' + Modal.item.imagem ?? ''
        nomeModal.innerText = Modal.item.nome ?? ''
        valorModal.innerHTML = '<b>Valor:</b> R$' + Modal.item.preco.replace('.', ',')
        totalModal.innerHTML = '<b>Total:</b> R$' + String(Number(Modal.item.preco)  * Modal.item.qtdProduto).replace('.', ',')
        quantidade.value = Modal.item.qtdProduto
    },
    maisQtd: () => {
        if(Modal.item.qtdProduto < Modal.item.estoque){
            Modal.item.qtdProduto++
            Modal.carregar()
        }
    },
    menosQtd: () => {
        if(Modal.item.qtdProduto > 1){
            Modal.item.qtdProduto--
            Modal.carregar()
        }
    },
    adicionar: () =>{
        Carrinho.adicionar(Modal.item)
        Modal.fechar()
    },
    finalizar: () => {
        Carrinho.adicionar(Modal.item)
        Modal.fechar()

        setTimeout(() => {
            Carrinho.abrir()
        }, 300);
    
    }
}