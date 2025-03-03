const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  try {
    const user = await User.findOne({ username });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: 'incorrect credentials' });
      return;
    }

    const token = await jwt.sign(
      { username: user.username, id: user._id },
      process.env.token,
      { algorithm: 'HS256', expiresIn: '360s' },
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: 'incorrect credentials' });
  }
});

router.post('/signup', (req, res) => {
  const { username, password, campus, course } = req.body;

  if (!username || !password || !campus || !course ) {
    res.status(400).json({ message: 'Complete all fields' });
    return;
  }

  if (password.length < 7) {
    res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    return;
  }

  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: 'Username check went bad.' });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'Username taken. Choose another one.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      username,
      password: hashPass,
      course,
      campus,
    });

    aNewUser.save((err) => {
      if (err) {
        res.status(400).json({ message: 'Saving user to database went wrong.' });
        return;
      }

      res.status(200).json({ message: 'User saved in database with success' });
    });
  });
});

module.exports = router;
