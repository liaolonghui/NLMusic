// 前端客户相关接口    signup signin vertify exit getUser
module.exports = app => {
  const router = require('express').Router();
  const nodeMailer = require('nodemailer'); // nodemailer
  const jwt = require('jsonwebtoken'); // jwt
  const mongoose = require('mongoose');

  const Config = require('./config/index') // smtp的配置
  const User = require('../models/User'); // User模型
  const Code = require('../models/Code'); // Code模型


  // 注册
  router.post('/signup', async (req, res) => {
    const {
      username,
      password,
      email,
      code
    } = req.body;
    // 校验code
    if (code) {
      // 取出验证码和过期时间
      const item = await Code.findOne({
        username: `nodemail:${username}`
      })
      let saveCode = item.code;
      let saveExpire = item.expire;
      console.log(saveCode, code)
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
        res.send({
          code: 1,
          msg: '注册成功'
        })
      } else {
        res.send({
          code: -1,
          msg: '注册失败'
        })
      }
    } else {
      res.send({
        code: -1,
        msg: '请填写验证码'
      });
    }
  })


  // 登录
  router.post('/signin', async (req, res) => {
    const {username, password} = req.body;
    // 从数据库查找
    const user = await User.findOne({username});
    if (user) {
      if (password === user.password) {
        // 发放token等
        const token = jwt.sign({ id: user._id }, app.get('secret'));
        res.send({
          code: 1,
          token,
          msg: '登录成功'
        })
      } else {
        res.send({
          code: -1,
          msg: '密码错误'
        })
      }
    } else {
      res.send({
        code: -1,
        msg: '用户不存在'
      })
    }
  });

  // 验证码
  router.post('/verify', async (req, res)=>{
    const { username } = req.body;
    const item = await Code.findOne({
      username: `nodemail:${username}`
    })
    // Expire 未过期就直接返回
    if (item && item.expire && item.expire - new Date().getTime() > 0) {
      res.send({
        code: -1,
        msg: '验证码一分钟只能请求一次'
      });
      return false;
    }
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
    await transporter.sendMail(mailOptions,async (error,info)=>{
        if(error){
          return console.log('error')
        }else{
          const c = await Code.findOne({username: `nodemail:${username}`})
          if (c && c._id) {
            await Code.findByIdAndUpdate(c._id, {
              username: `nodemail:${username}`,
              email: ko.email,
              code: ko.code,
              expire: ko.expire
            })
          } else { 
            await Code.create({
              username: `nodemail:${username}`,
              email: ko.email,
              code: ko.code,
              expire: ko.expire
            })
          }
        }
    })
    res.send({
        code: 0,
        msg: '验证码已发送，可能会有延迟，有效期1分钟'
    });
  });

  // 获取用户信息
  router.get('/getUser', async (req, res) => {
    const token = req.headers.authorization;
    if (token) {
      const { id } = jwt.verify(token, app.get('secret'));
      if (!id) {
        return res.send({
          code: -1,
          msg: '请重新登陆' //无效token
        })
      }
      const user = await User.findById(id).populate('musics Albums Singers');
      if (!user) {
        return res.send({
          code: -1,
          msg: '用户已注销' // 可能已注销...
        })
      }
      res.send({
        code: 1,
        msg: '用户信息获取成功',
        user: {
          username: user.username,
          email: user.email,
          musics: user.musics,
          albums: user.Albums,
          singers: user.Singers
        }
      })
    } else {
      res.send({
        code: -1,
        msg: '请在登陆后获取用户信息'
      })
    }
  });

  // 收藏专辑
  router.post('/likeAlbum', async (req, res) => {
    const albumID = String(req.body.albumID);
    const token = req.headers.authorization;
    const { id: userID } = jwt.verify(token, app.get('secret'));
    // 获取用户信息，然后在其基础上添加新数据
    const user = await User.findById(userID);
    // 原先收藏专辑中有则不再添加
    if (user.Albums.indexOf(albumID) !== -1) {
      res.send({
        code: -1,
        msg: '此专辑已在专辑收藏夹中'
      });
      return false;
    }
    // 把要添加的专辑id加进去
    const newAlbums = [...user.Albums, albumID]
    const model = await User.findByIdAndUpdate(userID, {
      $set: {
        "Albums": newAlbums
      }
    });
    if (model) {
      res.send({
        code: -1,
        msg: '专辑收藏成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '专辑收藏失败'
      });
    }
  })

  app.use('/client/users', router);
}