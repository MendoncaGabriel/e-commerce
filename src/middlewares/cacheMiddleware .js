const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // TTL padrão de 24 horas

const cacheMiddleware = (req, res, next) => {
    const key = req.originalUrl; // Usar a URL completa como chave de cache

    let page = cache.get(key);

    if (page) {
        res.send(page);
    } else {
        res.originalRender = res.render;
        res.render = (view, options, callback) => {
            res.originalRender(view, options, (err, html) => {
                if (!err) {
                    cache.set(key, html);
                }
                if (callback) callback(err, html);
                else res.send(html);
            });
        };
        next();
    }
};

module.exports = cacheMiddleware;
