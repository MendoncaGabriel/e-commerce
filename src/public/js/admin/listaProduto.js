function deleteProduto(id){
    const res = prompt('Atenção!, isto ira apagar o produto, variantes e imagens deseja continuar?: sim/não')
    if(res != "sim") return;

    fetch('/produto/delete/'+id, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
        window.location.reload()
    })
    .catch(error => {
        alert('Erro ao remover produto!')
        console.log(error)
    })
}