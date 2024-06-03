const rua = document.getElementById('rua');
const numero = document.getElementById('numero');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const uf = document.getElementById('estado');
const pontoReferencia = document.getElementById('referencia');
const telefone = document.getElementById('telefone');
const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');
const btnPagar = document.getElementById('btnPagar');
const btnCopiarPix = document.getElementById('btnCopiarPix');
const fecharSectionPix = document.getElementById('fecharSectionPix');
const adicionalEntrega = document.getElementById('adicionalEntrega');
const entrega = document.querySelectorAll('[name=entrega]');
const inputCep = document.getElementById('cep');

//DETECTAR ALTERAÇÃO
rua.addEventListener('input', ()=> exibirBtnSalvar());
numero.addEventListener('input', ()=> exibirBtnSalvar());
bairro.addEventListener('input', ()=> exibirBtnSalvar());
cidade.addEventListener('input', ()=> exibirBtnSalvar());
uf.addEventListener('input', ()=> exibirBtnSalvar());
pontoReferencia.addEventListener('input', ()=> exibirBtnSalvar());
telefone.addEventListener('input', ()=> exibirBtnSalvar());


// FUNÇÕES
function exibirBtnSalvar(){
    btnSalvarEndereco.classList.replace('hidden', 'block');
};
function esconderBtnSalvar(){
    btnSalvarEndereco.classList.replace('block', 'hidden');
};
function validarFormulario(){
    let time = 2000;
    if(rua.value.length == 0 ) { 
        rua.classList.add('border-2', 'border-red-500'), setTimeout(() => {rua.classList.remove('border-2', 'border-red-500')}, time); return false;
    }
    else if(numero.value.length == 0 ) { 
        numero.classList.add('border-2', 'border-red-500'), setTimeout(() => {numero.classList.remove('border-2', 'border-red-500')}, time); return false;
    }
    else if(bairro.value.length == 0 ) { 
        bairro.classList.add('border-2', 'border-red-500'), setTimeout(() => {bairro.classList.remove('border-2', 'border-red-500')}, time); return false;
    }
    else if(cidade.value.length == 0 ) { 
        cidade.classList.add('border-2', 'border-red-500'), setTimeout(() => {cidade.classList.remove('border-2', 'border-red-500')}, time); return false;
    }
    else if(uf.value.length == 0 ) { 
        uf.classList.add('border-2', 'border-red-500'), setTimeout(() => {uf.classList.remove('border-2', 'border-red-500')}, time); return false;
    }
    else if(telefone.value.length == 0 ) { 
        telefone.classList.add('border-2', 'border-red-500'), setTimeout(() => {telefone.classList.remove('border-2', 'border-red-500')}, time); return false;
    }
    else{
        return true;
    }
};
function indicadorDeProgresso(){
    let tempo = 180; // 3 minutos em segundos
    let maximo = 180
    const ContadorTempo = document.querySelector('#ContadorTempo');
    const progressbar = document.querySelector('.progress-bar');

    let contador = setInterval(() => {
        tempo -= 1;
        
        // Calcula minutos e segundos
        const minutos = Math.floor(tempo / 60);
        const segundos = tempo % 60;

        // Formata minutos e segundos com dois dígitos
        const minutosFormatados = minutos < 10 ? `0${minutos}` : minutos;
        const segundosFormatados = segundos < 10 ? `0${segundos}` : segundos;

        // Atualiza o texto do contador
        ContadorTempo.innerText = `${minutosFormatados}:${segundosFormatados}`;

        // Atualiza a barra de progresso
        progressbar.style.setProperty('--progress', (tempo / maximo) * 100);

        if (tempo <= 0) {
            clearInterval(contador);
            alert('Pix Inspirado! Atualize a página se precisar gerar outro.');
        }
    }, 1000);
};
function buscarEndereco(cep) {
    return new Promise((resolve, reject) => {
        if(!cep) throw new Error('cep não informado')
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            reject(error)
        });
    })
};
async function handleInputCep(cep){
    if(cep.length == 9){
        const endereco = await buscarEndereco(cep);
        document.querySelector('#bairro').value = endereco.bairro || '';
        document.querySelector('#referencia').value = endereco.complemento || '';
        document.querySelector('#rua').value = endereco.logradouro || '';
    }
};
async function mostrarModalQrCode(copiarColar, CodeQr){
    const qrCode = document.getElementById('qrCode')
    qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(CodeQr)}`; // Correção aqui
    btnCopiarPix.setAttribute('chaveCopiarColar', copiarColar)

    setTimeout(()=> {
        document.getElementById('sectionPix').classList.remove('hidden');
        document.getElementById('carrinho').classList.add('hidden');
        indicadorDeProgresso();
    },500)
};

// EVENTOS
btnPagar.addEventListener('click', (event) => {
    if (!validarFormulario()) return;

    const button = event.currentTarget;
    button.onclick = null;

    // Adicionando carregamento
    button.innerHTML = `
    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-c5 animate-spin fill-c1 border-none" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>`;

    fetch('/pagamento/pix', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(res => {
        const copiarColar = res.result.additional_data.qr_code;
        const CodeQr = res.result.additional_data.qr_code;

        mostrarModalQrCode(copiarColar, CodeQr);

        // Removendo carregamento
        button.innerHTML = `
            <img src="/icons/logo-pix-520x520.png" alt="" class="w-10 drop-shadow-lg">
            <p class="text-xl leading-none drop-shadow-lg">PAGAR COM PIX</p>
        `;
    })
    .catch((error) => {
        console.error(error);
        // Removendo carregamento
        button.innerHTML = `
            <img src="/icons/logo-pix-520x520.png" alt="" class="w-10 drop-shadow-lg">
            <p class="text-xl leading-none drop-shadow-lg">PAGAR COM PIX</p>
        `;
    });
});
btnSalvarEndereco.addEventListener('click', ()=>{
    if(!validarFormulario()) return;
  

    const data = {
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numero_casa: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        referencia: document.getElementById('referencia').value,
    }

    fetch('/usuario/endereco', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        btnSalvarEndereco.classList.replace('bg-green-500', 'bg-blue-500');
        setTimeout(() => {
            esconderBtnSalvar();
            btnSalvarEndereco.classList.replace('bg-blue-500', 'bg-green-500');
        }, 1000);
    })
    .catch((erro)=>{
        btnSalvarEndereco.classList.replace('bg-green-500', 'bg-red-500');
        setTimeout(() => {
            esconderBtnSalvar();
            btnSalvarEndereco.classList.replace('bg-red-500', 'bg-green-500');
        }, 1000);
    })
});
fecharSectionPix.addEventListener('click', ()=>{
    document.getElementById('sectionPix').classList.add('hidden')
    document.getElementById('carrinho').classList.remove('hidden')
});
btnCopiarPix.addEventListener('click', (event) => {
    const btn = event.currentTarget
    btn.classList.replace('bg-blue-500', 'bg-green-500')
    btnCopiarPix.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg>
    <p >PIX COPIADO</p>`
    
    setTimeout(() => {
        btn.classList.replace('bg-green-500', 'bg-blue-500')
        btnCopiarPix.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
        </svg>
        <p >COPIAR PIX</p>`
    }, 2000);

    // Cria um elemento input para armazenar o texto
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = btn.getAttribute('chaveCopiarColar');

    // Adiciona o elemento input ao corpo do documento
    document.body.appendChild(input);

    // Seleciona o texto dentro do elemento input
    input.select();
    input.setSelectionRange(0, 99999); // Para dispositivos móveis

    // Copia o texto para a área de transferência do usuário
    document.execCommand('copy');

    // Remove o elemento input
    document.body.removeChild(input);
});
entrega.forEach(e => {
    e.addEventListener('change', (event)=> {
        if(event.target.value != "" && Number(event.target.value ) > 1){
            adicionalEntrega.innerText = `+ R$ ${String(event.target.value).replace('.', ',')}`
            event.target.classList.replace('hidden', 'block')
        }else{
            adicionalEntrega.innerText = ''
            event.target.classList.replace('block', 'hidden')
        }
    });
});
inputCep.addEventListener('keyup', (event) =>{
    handleInputCep(event.target.value)
});



// Formatação
var cleaveCEP = new Cleave('[name=cep]', {
    delimiters: ['-'],
    blocks: [5, 3],
    numericOnly: true
});
var cleaveTelefone = new Cleave('[name=telefone]', {
    delimiters: ['(', ') ', '-', ' '],
    blocks: [0, 2, 5, 4],
    numericOnly: true
});