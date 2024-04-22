// game.model.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    score: { type: Number, default: 0 }, // Maintain the score
    user: {
        name: { type: String, required: true },
        userId: { type: String, required: true }  
    }
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game; 
