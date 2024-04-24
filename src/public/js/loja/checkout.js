function rerarPixQrCode(btn, valor){
    //remover função do botão
    btn.onclick = null;
    console.log(Number(valor))

    fetch('/api/pagamento/qrcodepix', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({valor: Number(valor)})
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        res.additional_data.qr_code
        motrarModalQrCode(res.additional_data.qr_code)
    })
}

async function motrarModalQrCode(textoQRCode ){
    const qrCode = document.getElementById('qrCode')
    qrCode.src = await `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${textoQRCode}`
    document.getElementById('sectionPix').classList.remove('hidden')

}

function fecharSectionPix(){
    document.getElementById('sectionPix').classList.add('hidden')
}