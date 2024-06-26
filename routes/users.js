const express = require("express");
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcrypt');
router.get('/signup', (req, res) => {
  res.render('pages/signup',{layout:false});
});
router.get('/login', (req, res) => {
  // If the session contains a user, redirect to '/'
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  // Otherwise, render the login page
  res.render('pages/login', { layout: false });
});

router.post('/signup', async (req, res) => {
  const { username, password, admincode } = req.body;
  const isAdmin = admincode === '1122';

  // Check if the username is already taken
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).send('Username is already taken');
  }

  // Create a new user
  const user = new User({ username, password, isAdmin });
  await user.save();

  // Store the user in the session
  req.session.user = user;
  res.redirect('/users/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user
  const user = await User.findOne({ username });

  // Check the password
  if (user && await bcrypt.compare(password, user.password)) {
    // If the credentials are correct, store the user in the session
    req.session.user = user;
    res.redirect('/products/addproducts');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;