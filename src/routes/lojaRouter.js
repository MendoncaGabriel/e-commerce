const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pages/lojaController')

router.get('/', pageController.home);
router.get('/produto/:nome', pageController.produto);

module.exports = router