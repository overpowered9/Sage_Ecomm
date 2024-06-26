const express = require('express');
const router = express.Router();
const ContactForm = require('../models/ContactForm'); // Import your ContactForm model

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contactus');
});

router.post('/contact', async (req, res) => {
  const { email, message } = req.body;

  // Save the form submission to the database
  const contactForm = new ContactForm({ email, message });
  await contactForm.save();

  // Show a success message
    res.send('Form submitted successfully');
  res.redirect('/');
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/aboutus');
});

module.exports = router;