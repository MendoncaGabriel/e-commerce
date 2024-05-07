function enviar(){
    if(document.getElementById('senha').value.length == 0 || document.getElementById('email').value.length == 0)  alert("Preencha o formulario!");

    fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        })
    })
    .then(res => res.json())
    .then(res => {
        if(JSON.stringify(res).includes('Senha incorreta!')) {alert(res); return};

        alert('Logado com sucesso!')
        window.location.href = '/'
    })
}



window.addEventListener('DOMContentLoaded', (event) => {
    animacao();
});

function animacao() {
    const container = document.getElementById('container');
    const images = container.querySelectorAll('img');
    const duration = 1500; // Duração da animação em milissegundos
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
