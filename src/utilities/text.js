module.exports = {
    capitalizar: (texto) => {
        return texto.replace(/\b\w/g, function(l) {
            return l.toUpperCase();
        });
    }
};