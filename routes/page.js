const express = require('express')
const router = express.Router()
const pageController = require('../controllers/pageController')

router.get('/',  pageController.home)
router.get('/produtos/:nome',  pageController.produtos)

module.exports = router