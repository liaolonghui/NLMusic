module.exports = app => {
  const mongoose = require('mongoose');

  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true) //加上这个
  mongoose.connect('mongodb://127.0.0.1:27017/qq-music', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.log('数据库连接失败！'+err);
    } else {
      console.log('数据库连接成功');
    }
  });

}