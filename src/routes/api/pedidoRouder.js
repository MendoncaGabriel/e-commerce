require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pedidoController = require('../../controllers/pedidoController');

function getUser(req, res, next) {
    try {
        const tokenUser = req.cookies.token;

        if (!tokenUser) {
            return res.status(401).send('Access Denied: No Token Provided!');
        }

        const decoded = jwt.verify(tokenUser, process.env.ASSINATURA_TOKEN);

        if (!decoded) {
            return res.status(401).send('Access Denied: Invalid Token!');
        }

        req.locals = decoded; // Use res.locals para armazenar o usuário

        next();
    } catch (error) {
        console.log(error)
        res.status(400).send('Invalid Token');
    }
}

router.get('/', getUser, pedidoController.createPedido);

module.exports = router;