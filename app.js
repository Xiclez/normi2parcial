const express = require('express');
const mongoose = require('mongoose');
const wordroutes = require('./routes/words.routes');
const userRoutes = require('./routes/user.routes');
const gameRoutes = require('./routes/game.routes');


const app = express();
const port = 3000; 
const db = 'mongodb+srv://ibarraorvil:Sooth0212@cluster0.dh71ixn.mongodb.net/';

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB database'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
  

app.use('/', wordroutes); 
app.use('/users', userRoutes);
app.use('/game',gameRoutes);


app.listen(port, () => {
  console.log(`Random word API listening on port ${port}`);
});
