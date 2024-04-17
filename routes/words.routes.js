const express = require('express');
const router = express.Router();
const wordController = require('../controllers/words.controller');

router.get('/word', wordController.getRandomWord); 

module.exports = router;
