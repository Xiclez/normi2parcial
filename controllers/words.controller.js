const fs = require('fs');

const getRandomWord = (req, res) => {
  fs.readFile('utils/words.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading word list');
    } else {
      const words = JSON.parse(data);
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex];
      res.json({ word: randomWord });
    }
  });
};

module.exports = { getRandomWord };
