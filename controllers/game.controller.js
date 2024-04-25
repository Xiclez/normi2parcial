const User = require('../models/user.model');
const Game = require('../models/game.model');
const CurrentGame = require('../models/currentGame.model')

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
  if (!wordList) { return null; } 

  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];};

let currentGameState = null;

loadWordList();

const startGame = async (req, res) => {
  let user = null;
  const userId = req.body.userId;

  console.log('startGame: Initializing currentGameState', currentGameState); 
  // 2. Fetch user from database
  try {
      user = await User.findOne({ userId });
       // Search by 'userId' field
      if (!user) {
          return res.status(404).send('User not found');
      }
  } catch (err) {
      console.error(err);
      return res.status(500).send('Error fetching user');
  }

  try {
      // 3. Get a random word
      const randomWordData = getRandomWord(); 
      if (!randomWordData) {
          return res.status(500).send('Word list not loaded');
      }
      console.log('startGame: Initial word:', randomWordData);

      // 4. Initialize Game State
      const gameState = {
          currentWord: randomWordData,
          providedWords: [],
          remainingTime: 20, 
          score: 0,
          user: { // Add user information 
              name: user.name,
              userId: user.userId // Potentially add userId
          }
      };
      const currentGame = new CurrentGame(gameState);
      await currentGame.save();
      currentGameState = gameState;

      // 5. Start the timer (Simplified)
      const timer = setInterval(() => {
          gameState.remainingTime--;
          if (gameState.remainingTime === 0) {
              clearInterval(timer);
              // ... (Handle game over logic - you might move this to a separate function)
          }
      }, 1000);

      // 6. Send initial game state 
      res.status(200).send({
          message: 'Game started!',
          ...gameState // Send the entire game state
      }); 
  } catch (err) {
      console.error(err);
      return res.status(500).send('Error starting the game');
  }
  console.log('startGame: Sending initial state; currentWord:', currentGameState.currentWord);

};
const playTurn = async (req, res) => {
 // console.log('playTurn: Received gameState; currentWord:', currentGameState.currentWord);
  // 1. Get user word from request body
  const userWord = req.body.word;
  const userId = req.body.userId;

  const wordRegex = /^[a-zA-Z0-9]+$/;
  if (!wordRegex.test(userWord)) {
    return res.status(400).json({ 
      message: 'Provided word should contain only letters and numbers'
  });
}
  let currentGame = await CurrentGame.findOne({ 'user.userId': userId }); // Filter by userId
  if (!currentGame) {
    return res.status(500).send('Game state not found');
  }
  if (!userWord) {
      return res.status(400).send('Missing "word" in request body');
  }
  if (currentGameState.remainingTime === 0) {
      try {
          const gameToSave = new Game({
              score: currentGameState.score,
              user: currentGameState.user 
          }); 
          await gameToSave.save(); 
          console.log('Game saved successfully!');

          await CurrentGame.deleteOne();
        currentGameState = null;
      } catch (err) {
          console.error('Error saving game:', err);
      }
      const scoreboard = await Game.find().sort({ score: -1 });
  
      return res.status(403).json({ 
          message: 'Game over!',
          scoreboard 
      });
  }

  // 2. Retrieve game state (You'll need a mechanism to store/access this)
  const gameState = currentGameState; // Get the current game state
  console.log('playTurn: Received gameState:', gameState);
  const lastLetter = currentGameState.currentWord.slice(-1);


  // 3. Validate word
  if (userWord[0].toLowerCase() === lastLetter.toLowerCase() &&
      !currentGameState.providedWords.includes(userWord.toLowerCase())) {
    
      // Word is valid 
      currentGameState.providedWords.push(userWord);
      console.log('Searching for a word starting with:', lastLetter); 
      let newWord = null;
do {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  newWord = wordList[randomIndex]; // Access the 'word' property
} while (newWord[0].toLowerCase() !== lastLetter.toLowerCase());

      currentGameState.currentWord = newWord; 
      console.log('playTurn: Updated currentWord to:', currentGameState.currentWord)
      currentGameState.remainingTime = 20;
      currentGameState.score++;

      res.status(200).send({
          message: 'Word accepted',
          ...currentGameState
      });
       
  } else {
      // Word is invalid
      res.status(400).send('Invalid word'); 
  }

  for (let key in currentGameState) {
    if (Object.hasOwnProperty.call(currentGame, key)) { // Check for existing properties
      currentGame[key] = currentGameState[key]; 
    }
  }
  await currentGame.save(); };

  function getLastLetter(word) {
    return word.slice(-1);
  }
  
  async function fetchNewWord(lastLetter) { 
    let newWord = null;
    do {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      newWord = wordList[randomIndex]; 
    } while (newWord[0].toLowerCase() !== lastLetter.toLowerCase());
    return newWord;
  }
  
  // (This function remains the same if its only purpose is counting provided words)
  function countProvidedWords(providedWordsArray) {
    return providedWordsArray.length;
  }

module.exports = { startGame, playTurn, getLastLetter, fetchNewWord,countProvidedWords };
