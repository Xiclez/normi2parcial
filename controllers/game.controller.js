const User = require('../models/user.model'); // Import User model
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

let currentGameState = null;

loadWordList();

const startGame = async (req, res) => {
    //console.log('startGame: Initializing currentWord:', currentGameState.currentWord); 
    // 1. Get user ID from request
    const userId = req.body.userId; // Assuming you're using :userId in your route

    console.log('startGame: Initializing currentGameState', currentGameState); 
    // 2. Fetch user from database
    try {
        const user = await User.findOne({ userId }); // Search by 'userId' field
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
        console.log('startGame: Initial word:', randomWordData.word);

        // 4. Initialize Game State
        const gameState = {
            currentWord: randomWordData.word,
            providedWords: [],
            remainingTime: 20, 
            score: 0 // Initialize score 
        };
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
    console.log('playTurn: Received gameState; currentWord:', currentGameState.currentWord);
    // 1. Get user word from request body
    const userWord = req.body.word;
    if (!userWord) {
        return res.status(400).send('Missing "word" in request body');
    }


    // 2. Retrieve game state (You'll need a mechanism to store/access this)
    const gameState = currentGameState; // Get the current game state
    console.log('playTurn: Received gameState:', gameState);
    const lastLetter = currentGameState.currentWord.word.slice(-1);


    // 3. Validate word
    if (userWord[0].toLowerCase() === lastLetter.toLowerCase() &&
        !currentGameState.providedWords.includes(userWord.toLowerCase())) {
      
        // Word is valid 
        currentGameState.providedWords.push(userWord);
        console.log('Searching for a word starting with:', lastLetter); 
        let newWord = null;
do {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    newWord = wordList[randomIndex].word; // Access the 'word' property
} while (newWord[0].toLowerCase() !== lastLetter.toLowerCase());

        currentGameState.currentWord = newWord; // Update with new word
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

    // ... (Rest of the playTurn logic) ...
};

const getLastLetter = (word) => {
    var word = (currentGameState.currentWord.word)
    console.log(word)
    return word.slice(-1);
  };
const validateWord = (word, lastLetter) => {
    const firstLetter = word[0];
    const isValid = firstLetter === lastLetter && 
                    wordList.includes(word.toLowerCase()) && 
                    !providedWords.includes(word.toLowerCase()); 
                    console.log(word)
    return isValid;
  };
  
const getWordStartingWith = (letter) => {
    const filteredWords = wordList.filter(word => word[0] === letter);
    // ... Logic to select a new word (consider unused words if possible)
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex].word; // Return the 'word' property
};

  
  const calculateScore = (providedWords) => {
    return providedWords.length;
  };
  
  const saveScore = async (userName, score) => {
    // ... (Implement database saving logic with Mongoose) 
    console.log('Saving score:', userName, score); 
  };

module.exports = { startGame, playTurn };
