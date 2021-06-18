const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  img: { type: String },
  video: { type: Array },
})

module.exports = mongoose.model('MV', schema);