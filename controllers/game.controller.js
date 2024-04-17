const User = require('../models/user.model'); // Import User model
const { getRandomWord, loadWordList } = require('./words.controller');

loadWordList(); 


const startGame = async (req, res) => {
    // 1. Get user ID from request
    const userId = req.body.userId; // Assuming you're using :userId in your route

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

        // 4. Initialize Game State
        const gameState = {
            currentWord: randomWordData.word,
            providedWords: [],
            remainingTime: 20, 
            score: 0 // Initialize score 
        };

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
};
const playTurn = async (req, res) => {
    // 1. Get user word from request body
    const userWord = req.body.word;
    if (!userWord) {
        return res.status(400).send('Missing "word" in request body');
    }

    // 2. Retrieve game state (You'll need a mechanism to store/access this)
    const gameState = ""; // Get the current game state

    // 3. Validate word
    const isValid = validateWord(userWord, getLastLetter(gameState.currentWord), wordList);

    if (!isValid) {
        return res.status(400).send('Invalid word'); 
    }

    // 4. Update game state
    gameState.providedWords.push(userWord);
    gameState.currentWord = getWordStartingWith(getLastLetter(userWord), wordList);
    gameState.score++; // Increment score

    // 5. Send Response
    res.status(200).send({
        message: 'Word accepted',
        ...gameState // Send updated game state
    });
};

const getLastLetter = (word) => {
    return word.slice(-1);  // Returns the last character
  };
const validateWord = (word, lastLetter, wordList) => {
    const firstLetter = word[0];
    const isValid = firstLetter === lastLetter && 
                    wordList.includes(word.toLowerCase()) && 
                    !providedWords.includes(word.toLowerCase()); 
    return isValid;
  };
  
  const getWordStartingWith = (letter, wordList) => {
    const filteredWords = wordList.filter(word => word[0] === letter);
    // ... Logic to select a new word (consider unused words if possible)
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[randomIndex]; 
  };
  
  const calculateScore = (providedWords) => {
    return providedWords.length;
  };
  
  const saveScore = async (userName, score) => {
    // ... (Implement database saving logic with Mongoose) 
    console.log('Saving score:', userName, score); 
  };

module.exports = { startGame };
