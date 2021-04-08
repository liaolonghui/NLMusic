const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },                                          // 歌曲
  singer: { type: mongoose.SchemaTypes.ObjectId, ref: 'Singer' },  // 歌手
  album: { type: mongoose.SchemaTypes.ObjectId, ref: 'Album' },    // 专辑
  music: { type: Array },                                         // 音乐数组（但只保存一个数据）
  love: { type: Number } // 收藏数
})

module.exports = mongoose.model('Music', schema);