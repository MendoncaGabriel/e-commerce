const NodeCache = require('node-cache');
const fs = require('fs-extra');
const path = require('path');
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // TTL padrão de 24 horas

const ssgMiddleware = (req, res, next) => {
    const key = req.originalUrl;
    const filePath = path.resolve('src','static', key.replace(/\//g, '_') + '.html');

    let page = cache.get(key);

    if (page) {
        res.sendFile(filePath);
    } else {
        fs.readFile(filePath, 'utf8')
            .then((html) => {
                cache.set(key, html);
                res.send(html);
            })
            .catch(async () => {
                res.originalRender = res.render;
                res.render = (view, options, callback) => {
                    res.originalRender(view, options, async (err, html) => {
                        if (!err) {
                            await fs.ensureDir(path.dirname(filePath));
                            await fs.writeFile(filePath, html);
                            cache.set(key, html);
                        }
                        if (callback) callback(err, html);
                        else res.send(html);
                    });
                };
                next();
            });
    }
};

module.exports = ssgMiddleware;
