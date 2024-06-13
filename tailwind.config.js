const paletaCores = require('./src/model/paleta.cores');

const carregarCoresDinamicamente = async () => {
    
    const paleta = await paletaCores.getById(1);
    console.log('================================')
    console.log('================================')
    
    console.log(paleta)
    console.log('================================')
    console.log('================================')
    return {
        c0: "#FFFFFF",
        c1: '#EC268F',
        c2: '#D886C3',
        c3: '#201E1E',
        c4: 'rgb(0 0 0)',
        c5: "#FFFFFF",
        avisoG2: '#EC268F',
        newsletter: "#EC4899",
        sigaNoInstagram: "#FFFFFF",
        footer: "#FFF212"
    };
};



module.exports = {
    content: ["./**/**/*.{ejs,js}"],
    theme: {
        extend: {
            colors: carregarCoresDinamicamente(), // Carrega as cores dinamicamente
        },
    },
    plugins: [],
};
