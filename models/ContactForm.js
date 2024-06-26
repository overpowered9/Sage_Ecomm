const mongoose = require('mongoose');

const ContactFormSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

const ContactForm = mongoose.model('ContactForm', ContactFormSchema);

module.exports = ContactForm;