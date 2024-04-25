const User = require('../models/user.model');

const registerUser = async (req, res) => {
  const { name } = req.body;

  // Validate user input
  if (!name) {
    return res.status(400).send('Missing name');
  }
  const nameRegex = /^[a-zA-Z0-9]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).send('Name should contain only letters and numbers');
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create a new user and save it to the database
    const user = new User({ name });
    await user.save();

    // Send a success response with the user ID
    res.status(201).send({ userId: user.userId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
};

module.exports = { registerUser };
