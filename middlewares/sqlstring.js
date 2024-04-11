const sqlstring = require('sqlstring');

function protecaoSQL(req, res, next) {
    const body = req.body;

    // Verificar se há potenciais injeções de SQL
    for (const key in body) {
        if (Object.hasOwnProperty.call(body, key)) {
            const value = body[key];
            if (typeof value === 'string' && sqlstring.escape(value) !== value) {
                // Se qualquer valor do corpo contiver código SQL, rejeitar a requisição
                return res.status(400).json({ error: 'Detected potential SQL injection!' });
            }
        }
    }

    // Se não houver potenciais injeções de SQL, permitir a passagem da requisição
    next();
}

module.exports = protecaoSQL;
