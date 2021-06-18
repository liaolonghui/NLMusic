const mongoose = require('mongoose');

const shema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  // 喜欢的歌曲，专辑，歌手
  musics: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Music' }],
  Albums: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Album' }],
  Singers: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Singer' }]
});

module.exports = mongoose.model('User', shema);