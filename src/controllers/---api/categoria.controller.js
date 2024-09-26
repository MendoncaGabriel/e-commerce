

module.exports = {

    atualizar:(req, res) => {
        const {id, name} = req.body
        console.log(id, name)
    }
}

