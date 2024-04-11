
module.exports = {
    home:  (req, res) => {
        try {
            res.render('ecommerce/home')
        } catch (error) {
            console.log(error)
        }

    },
    produtos: (req, res) => {
        try {
            res.render('ecommerce/produtos')
        } catch (error) {
            console.log(error)
        }
    }
}


