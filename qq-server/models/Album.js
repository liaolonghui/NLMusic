const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  singer: { type: mongoose.SchemaTypes.ObjectId, ref: 'Singer' },
  style: { type: mongoose.SchemaTypes.ObjectId, red: 'Style' },
  time: { type: String },  // 发行时间
  company: { type: String }  // 唱片公司
})

module.exports = mongoose.model('Album', schema);