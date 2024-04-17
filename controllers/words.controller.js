// words.controller.js
const fs = require('fs');

let wordList = null;

const loadWordList = () => { 
  try {
    const wordsData = fs.readFileSync('utils/words.json');
    wordList = JSON.parse(wordsData); 
  } catch (err) {
     console.error('Error loading word list:', err);
  }
};

const getRandomWord = () => { 
  if (!wordList) { return null; } // Handle the case before wordList is loaded

  const randomIndex = Math.floor(Math.random() * wordList.length);
  return { word: wordList[randomIndex] };
};

module.exports = { getRandomWord, loadWordList }; // Export both functions
