const criarContaBtn = document.getElementById('criarContaBtn')

criarContaBtn.addEventListener('click', ()=> {
    if(document.getElementById('senha').value != document.getElementById('confirmarSenha').value){
        document.getElementById('confirmarSenha').value = ''
        document.getElementById('senha').style.border = '2px solid #EF4947'
        document.getElementById('confirmarSenha').style.border = '2px solid #EF4947'
        document.getElementById('senha').addEventListener('click', ()=> document.getElementById('senha').style.border = 'none')
        document.getElementById('confirmarSenha').addEventListener('click', ()=> document.getElementById('confirmarSenha').style.border = 'none')
        alert('Senhas Não conferem!')
        return
    }
    console.log('fazendo fetch')
    fetch('/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value,
            telefone: document.getElementById('telefone').value
        })
    })
    .then(res => {
        if(res.status == 200) window.location.href = '/'
       return res.json()
    })
    .then(res => {
        alert(JSON.stringify(res.msg))
    })
    .catch((error) =>{
        alert(JSON.stringify(error.msg))
        window.location.reload();
    })
})



window.addEventListener('DOMContentLoaded', () => {
    animacao();
});
function animacao() {
    const container = document.getElementById('container');
    const images = container.querySelectorAll('img');
    const pauseDuration = 4000; // Duração da pausa em milissegundos
    const imageWidth = images[0].offsetWidth; // Largura de cada imagem
    let index = 0; // Índice da imagem atual

    function animate() {
        // Calcular a posição de rolagem para a próxima imagem
        const nextScrollLeft = index * imageWidth;

        // Rolar suavemente para a próxima imagem
        container.scrollTo({
            left: nextScrollLeft,
            behavior: 'smooth'
        });

        // Atualizar o índice para a próxima imagem
        index = (index + 1) % images.length;

        // Agendar a próxima animação após a pausa
        setTimeout(animate, pauseDuration);
    }

    // Iniciar a animação
    animate();
}


// Formatação
var cleaveTelefone = new Cleave('[name=telefone]', {
    delimiters: ['(', ') ', '-', ' '],
    blocks: [0, 2, 5, 4],
    numericOnly: true
});