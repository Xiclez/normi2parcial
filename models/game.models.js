const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    currentWord: { type: String, required: true }, 
    providedWords: { type: [String], default: [] },
    remainingTime: { type: Number, default: 20 },
    score: { type: Number, default: 0 }
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
