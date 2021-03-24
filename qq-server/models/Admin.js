const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String,
    select: false,
    set(val) {
      return require('bcrypt').hashSync(val, 10);  // bcrypt  散列
    }
  },
  telephone: { type: String },
  type: { type: String },    // 类型
  state: { type: Boolean }   // 状态
});

module.exports = mongoose.model('Admin', schema);