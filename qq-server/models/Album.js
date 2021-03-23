const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  singer: { type: mongoose.SchemaTypes.ObjectId, ref: 'Singer' },
  style: { type: mongoose.SchemaTypes.ObjectId, ref: 'Style' },
  time: { type: String },  // 发行时间
  company: { type: String },  // 唱片公司
  // musics: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Music' }]  // 有哪些音乐
})

module.exports = mongoose.model('Album', schema);