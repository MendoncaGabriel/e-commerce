let tentativas = 0;
let textoQRCode = '';
const rua = document.getElementById('rua');
const numero = document.getElementById('numero');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const uf = document.getElementById('estado');
const pontoReferencia = document.getElementById('referencia');
const telefone = document.getElementById('telefone');
const btnSalvarEndereco = document.getElementById('btnSalvarEndereco');

//DETECTAR ALTERAÇÃO
rua.addEventListener('input', ()=> exibirBtnSalvar());
numero.addEventListener('input', ()=> exibirBtnSalvar());
bairro.addEventListener('input', ()=> exibirBtnSalvar());
cidade.addEventListener('input', ()=> exibirBtnSalvar());
uf.addEventListener('input', ()=> exibirBtnSalvar());
pontoReferencia.addEventListener('input', ()=> exibirBtnSalvar());
telefone.addEventListener('input', ()=> exibirBtnSalvar());

function exibirBtnSalvar(){
    btnSalvarEndereco.classList.replace('hidden', 'block');
};
function esconderBtnSalvar(){
    btnSalvarEndereco.classList.replace('block', 'hidden');
};
function salvarFormulario(){
    if(!validarFormulario()) return;
    fetch('/api/usuario/endereco', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            rua: document.getElementById('rua').value || '',
            numero: document.getElementById('numero').value || '',
            bairro: document.getElementById('bairro').value || '',
            cidade: document.getElementById('cidade').value || '',
            estado: document.getElementById('estado').value || '',
            referencia: document.getElementById('referencia').value || '',
            telefone: document.getElementById('telefone').value || ''

        })
    })
    .then(res => res.json())
    .then(res => {
        btnSalvarEndereco.classList.replace('bg-green-500', 'bg-blue-500');
        setTimeout(() => {
            esconderBtnSalvar();
            btnSalvarEndereco.classList.replace('bg-blue-500', 'bg-green-500');
        }, 1000);
        console.log(res)
    })
    .catch((erro)=>{
        btnSalvarEndereco.classList.replace('bg-green-500', 'bg-red-500');
        setTimeout(() => {
            esconderBtnSalvar();
            btnSalvarEndereco.classList.replace('bg-red-500', 'bg-green-500');
        }, 1000);
    })
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
function mascara(src, mascara) {
    const campo = src.value.length;
    const texto = mascara.substring(campo);
    if (texto.charAt(0) !== '#') {
        src.value += texto.charAt(0);
        // Verifica se o próximo caractere na máscara é um espaço
        if (texto.charAt(1) === ' ') {
            src.value += ' ';
        }
    }
};
function gerarPixQrCode(btn, valor) {
    if (!validarFormulario()) return;
    const pedido = JSON.parse(window.pedido);
    if (!pedido) {
        alert('Erro: Pedidos não foram registrados...');
        window.location.reload();
        return;
    }

    // Remover função do botão
    btn.onclick = null;
    console.log(Number(valor));

    // GERAR PIX
    fetch('/api/pagamento/qrcodepix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: Number(valor) })
    })
    .then(res => {
        if (!res.ok && tentativas < 3) {
            setTimeout(() => {
                tentativas++;
                gerarPixQrCode(btn, valor);
            }, 500);
            throw new Error('Erro na resposta da requisição.');
        } else if (!res.ok) {
            alert('Erro ao gerar pix, vamos tentar novamente!')
            window.location.reload()
        }
        
        return res.json();
    })
    .then(res => {
        console.log(res);
        if (res.additional_data && res.additional_data.qr_code) {
            indicadorDeProgresso();
            textoQRCode = res.additional_data.qr_code;
            motrarModalQrCode(res.additional_data.qr_code);

            // REGISTRAR PEDIDO após gerar o QR Code
            return fetch('/api/usuario/pedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido)
            });
        } else {
            alert('Erro ao gerar pix, vamos tentar novamente!')
            window.location.reload()
            throw new Error('QR Code não encontrado na resposta.');
        }
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        // Aqui você pode adicionar qualquer tratamento adicional após registrar o pedido, se necessário.
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        // Adicione aqui qualquer tratamento de erro adicional, como mostrar uma mensagem de erro ao usuário.
    });
};
async function motrarModalQrCode(textoQRCode){
    const qrCode = document.getElementById('qrCode')
    qrCode.src = await `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${textoQRCode}`
    document.getElementById('sectionPix').classList.remove('hidden')

};
function fecharSectionPix(){
    document.getElementById('sectionPix').classList.add('hidden')
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
            console.log('Tempo Inspirado!');
            alert('Pix Inspirado! Atualize a página se precisar gerar outro.');
        }
    }, 1000);
};
function copiarPix(btn){
    btn.classList.replace('bg-blue-500', 'bg-green-500')
    document.getElementById('btnCopiarPix').innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
  </svg>
 <p >PIX COPIADO</p>`
    
    setTimeout(() => {
        btn.classList.replace('bg-green-500', 'bg-blue-500')
        document.getElementById('btnCopiarPix').innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
    </svg>
     <p >COPIAR PIX</p>`

        
    }, 2000);

    // Cria um elemento input para armazenar o texto
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = textoQRCode;

    // Adiciona o elemento input ao corpo do documento
    document.body.appendChild(input);

    // Seleciona o texto dentro do elemento input
    input.select();
    input.setSelectionRange(0, 99999); // Para dispositivos móveis

    // Copia o texto para a área de transferência do usuário
    document.execCommand('copy');

    // Remove o elemento input
    document.body.removeChild(input);


};
