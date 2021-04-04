const express = require('express');
const cors = require('cors');
const path = require('path');

let app = express();

// secret
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


app.listen(8888, () => {
  console.log('http://localhost:8888')
})