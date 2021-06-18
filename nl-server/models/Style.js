const mongoose = require('mongoose');

const shema = new mongoose.Schema({
  name: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Style', shema);