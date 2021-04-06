const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String, unique: true },
  code: { type: String },
  expire: { type: String }
})

module.exports = mongoose.model('Code', schema);