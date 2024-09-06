// models/Text.js
const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true }  // Change 'embedidng' to 'embedding'
});

module.exports = mongoose.model('Text', TextSchema);
