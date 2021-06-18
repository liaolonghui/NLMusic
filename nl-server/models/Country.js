const mongoose = require('mongoose');

const shema = new mongoose.Schema({
  country: { type: String },
  lang: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Country', shema);