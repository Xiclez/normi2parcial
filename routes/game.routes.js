const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');

router.post('/start', gameController.startGame); 
router.post('/play',gameController.playTurn);

module.exports = router;
