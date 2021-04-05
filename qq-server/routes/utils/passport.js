const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

  
passport.use(new LocalStrategy(async function(username, password, done) {
  try{
    const where = {
      username
    };
    const user = await User.findOne(where);
    if (user!=null) {
      if (password === user.password) {
        done(null, user);
      } else {
        done(null, false, '密码错误');
      }
    } else {
      done(null, false, '用户不存在');
    }
  }catch(err){
    return done(err);
  }
}));

// 序列化
passport.serializeUser(function(user,done){
  done(null,user)
})
// 反序列化
passport.deserializeUser(function(user,done){
  return done(null,user)
})

module.exports = passport