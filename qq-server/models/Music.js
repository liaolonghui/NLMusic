const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String },                                          // 歌曲
  singer: { type: mongoose.SchemaTypes.ObjectId, ref: 'Singer' },  // 歌手
  album: { type: mongoose.SchemaTypes.ObjectId, red: 'Album' },    // 专辑
  music: { type: String },                                         // 音乐
})

module.exports = mongoose.model('Music', schema);