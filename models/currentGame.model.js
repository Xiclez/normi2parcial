const mongoose = require('mongoose');

const currentgameSchema = new mongoose.Schema({
  currentWord: { type: String, required: true },
  providedWords: { type: [String], default: [] },
  remainingTime: { type: Number, default: 20 },
  score: { type: Number, default: 0 },
  user: {
    name: { type: String, required: true },
    userId: { type: String, required: true }  
  }
});

const currentGame = mongoose.model('CurrentGame', currentgameSchema);
module.exports = currentGame; 
