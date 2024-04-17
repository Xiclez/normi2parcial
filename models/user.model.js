const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true, default: uuidv4, index: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
