
function fecharMenu(){
    const menu = document.getElementById('menu');
    menu.classList.add('left-[-100%]');

    setTimeout(() => {
        menu.classList.add('hidden');
    }, 300);
};
function abrirMenu(){
    const menu = document.getElementById('menu');
    menu.classList.remove('hidden');
    
    setTimeout(() => {
        menu.classList.replace('left-[-100%]', 'left-0')
    }, 30);
};

function sairAuth(){
    fetch('/auth/logout', {
        method: 'GET',
    })
    .then(res => res.json())
    .then(res =>{
        alert('Até mais!'),
        window.location.href = '/'
        console.log(res)
    })
    .catch((error)=>{
        alert('Erro ao deslogar!')
        console.log(error)
    })
 }
 