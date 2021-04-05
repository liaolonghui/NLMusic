// 前端客户相关接口    signup signin vertify exit getUser
module.exports = app => {
  const router = require('express').Router();
  const Redis = require('redis');  // redis
  const nodeMailer = require('nodemailer'); // nodemailer
  const Config = require('./config');
  const Passport = require('./utils/passport');
  const axios = require('./utils/axios');
  const User = require('../models/User'); // User模型

  
  const Client = Redis.createClient();

  // 注册
  router.post('/signup', (req, res) => {
    const {
      username,
      password,
      email,
      code
    } = req.body;
    // 校验code
    if (code) {
      // 取出保存在redis的验证码和过期时间
      Client.hgetall(`nodemail:${username}`, async (err, value) => {
        if (!err) {
          let saveCode = value.code;
          let saveExpire = value.expire
          if (code == saveCode) {
            if (new Date().getTime() - saveExpire > 0) {
              res.send({
                code: -1,
                msg: '验证码已过期，请重新获取'
              });
              return false;
            }
          } else {
            res.send({
              code: -1,
              msg: '验证码错误'
            });
            return false;
          }
        }
        // 到这一步说明验证码通过
        const user = await User.find({username});
        if (user.length) {
          res.send({
            code: -1,
            msg: '用户名已被注册'
          })
          return false;
        }
        // 正式注册
        const nuser = await User.create({username, password, email});
        if (nuser) {
          const res = await axios.post('/users/signin', { username, password })
          if (res.data && res.data.code === 1) {
            res.send({
              code: 1,
              msg: '注册成功'
            })
          } else {
            res.send({
              code: -1,
              msg: 'error'
            })
            return false;
          }
        } else {
          res.send({
            code: -1,
            msg: '注册失败'
          })
          return false;
        }
      });
    } else {
      res.send({
        code: -1,
        msg: '请填写验证码'
      });
      return false;
    }
  })


  // 登录
router.post('/signin', async (req, res, next) => {
  return Passport.authenticate('local',function(err,user,info,status){
    if(err){
      res.send({
          code: -1,
          msg: err
      });
      return res.end();
    }else{
      if(user){
        res.send({
            code: 0,
            msg: '登录成功',
            user
        });
        return req.login(user, () => {})
      }else{
        res.send({
            code: 1,
            msg: info
        });
        return false;
      }
    }
  })(req, next)
});

router.post('/verify', async (req, res)=>{
  let transporter = nodeMailer.createTransport({
      host:Config.smtp.host,
      port:587,
      secure:false,
      auth:{
          user: Config.smtp.user,
          pass: Config.smtp.pass
      }
  })
  let ko = {
      code: Config.smtp.code(),
      expire: Config.smtp.expire(),
      email: req.body.email,
      user: req.body.username
  }
  let mailOptions = {
      from: `"认证邮件" <${Config.smtp.user}>`,
      to: ko.email,
      subject: '南理音乐注册码',
      html: `欢迎您在南理音乐注册账号，您的验证码是${ko.code}`
  }
  await transporter.sendMail(mailOptions,(error,info)=>{
      if(error){
        return console.log('error')
      }else{
        Client.hmset(`nodemail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)
      }
  })
  res.send({
      code: 0,
      msg: '验证码已发送，可能会有延迟，有效期1分钟'
  });
});

router.get('/exit',async (req, res)=>{
  console.log(req.isAuthenticated())
  await req.logout();
  if(!req.isAuthenticated()){
    res.send({
        code: 0,
    });
  }else{
    res.send({
        code: -1
    });
  }
});

router.get('/getUser',async (req, res)=>{
  console.log(req.isAuthenticated())
  if(req.isAuthenticated()){
    const {username, email} = req.session.passport.user;
    res.send({
        user:username,
        email
    });
  }else{
    res.send({
        user:'',
        email:''
    });
  }
});

  app.use('/users', router);
}