function mascara(mascara, documento){
    var i = documento.value.length;
    var saida = mascara.substring(0,1);
    var texto = mascara.substring(i)
    
    if (texto.substring(0,1) != saida){
        documento.value += texto.substring(0,1);
    }
}
  
  


const moeda = document.querySelectorAll('[mascara=moeda]')
moeda.forEach((element) => {
    element.addEventListener('input', (event)=>{
        if(event.data != null){
       
            mascara('##,##', element)
            element.setAttribute('maxlength', '5')
        }

    })
})
