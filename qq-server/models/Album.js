const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },
  singer: { type: mongoose.SchemaTypes.ObjectId, ref: 'Singer' },
  style: { type: mongoose.SchemaTypes.ObjectId, ref: 'Style' },
  time: { type: String },  // 发行时间
  company: { type: String },  // 唱片公司
  img: { type: String },     // 专辑图
  // musics: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Music' }]  // 有哪些音乐
  comments: [{ type: String }], // 评论
  love: { type: Number } // 收藏数
})

module.exports = mongoose.model('Album', schema);