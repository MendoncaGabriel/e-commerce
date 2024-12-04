const imagemSlideProduto = document.querySelectorAll('.imagemSlideProduto')
const containerSlideProduto = document.querySelector('#containerSlideProduto')
const larguraImagem = imagemSlideProduto[0]?.offsetWidth
var index = 1

function voltarSlide(){
    // Calcular a posição de rolagem para a próxima imagem
    const nextScrollLeft = index * larguraImagem;
        
    // Rolar suavemente para a próxima imagem
    containerSlideProduto.scrollTo({
        left: nextScrollLeft * -1,
        behavior: 'smooth'
    });

    // Atualizar o índice para a próxima imagem
    index = (index + 1) % imagemSlideProduto.length;
}

function passarSlide(){
    // Calcular a posição de rolagem para a próxima imagem
    const nextScrollLeft = index * larguraImagem;
        
    // Rolar suavemente para a próxima imagem
    containerSlideProduto.scrollTo({
        left: nextScrollLeft,
        behavior: 'smooth'
    });

    // Atualizar o índice para a próxima imagem
    index = (index + 1) % imagemSlideProduto.length;
}