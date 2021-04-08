const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  birth: { type: String },
  sex: { type: String },
  country: { type: mongoose.SchemaTypes.ObjectId, ref: 'Country' },
  style: { type: mongoose.SchemaTypes.ObjectId, ref: 'Style' },
  description: { type: String },
  img: { type: String },
  love: { type: Number } // 收藏数
});

module.exports = mongoose.model('Singer', schema);