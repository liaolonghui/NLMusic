const express = require('express');
const cors = require('cors');
const path = require('path');

const passport = require('./routes/utils/passport'); // passport
const Config = require('./routes/config/index'); // config

const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const Redisclient  = redis.createClient(Config.redis.port, Config.redis.host);// 默认监听6379端口,'127.0.0.1'为你本地ip(默认不需要修改)
const RedisStore = require('connect-redis')(session);

let app = express();

app.use(cookieParser());
// redis 链接错误
Redisclient.on("error", function(error) {
  console.log(error);
});
const identityKey = 'nlyy';
app.use(session({
    name: identityKey,
    secret: 'sessiontest',  // 用来对session id相关的cookie进行签名
    store: new RedisStore({ client: Redisclient }),  // (使用redis的存储session)
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 30*60 * 1000  // 有效期，单位是毫秒, 这里设置的是30分钟
    }
}));

// passport
app.use(passport.initialize());
app.use(passport.session());


// secret(用于token认证)后台管理用的是token验证
app.set('secret', 'asfdghjhgfds');

app.use(cors());
app.use(express.json());

// 数据库
require('./plugins/db')(app);

// 静态资源
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));
app.use('/uploadMusic', express.static(path.join(__dirname + '/musics')));
app.use('/uploadMV', express.static(path.join(__dirname + '/mvs')));

// 路由
require('./routes/admin')(app);
require('./routes/client')(app);
require('./routes/users')(app);


app.listen(8888, () => {
  console.log('http://localhost:8888')
})