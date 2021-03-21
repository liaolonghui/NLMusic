const express = require('express');
const cors = require('cors');

let app = express();

app.use(cors());
app.use(express.json());

// 数据库
require('./plugins/db')(app);

// 路由
require('./routes/admin')(app);
require('./routes/client')(app);

app.listen(8888, () => {
  console.log('http://localhost:8888')
})