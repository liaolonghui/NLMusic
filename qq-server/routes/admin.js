module.exports = app => {
  const router = require('express').Router({
    mergeParams: true
  });
  const multer = require('multer');
  const jwt = require('jsonwebtoken');

  const Country = require('../models/Country');
  const Style = require('../models/Style');
  const Singer = require('../models/Singer');
  const Album = require('../models/Album');
  const Music = require('../models/Music');
  const Admin = require('../models/Admin');

  // country
  // 增
  router.post('/tag/addCountry', async (req, res) => {
    const model = await Country.create(req.body);
    res.send(model);
  });
  // 删
  router.delete('/tag/deleteCountry/:id', async (req, res) => {
    await Country.findByIdAndDelete(req.params.id);
    res.send({
      success: true
    });
  });
  // 改
  router.put('/tag/updateCountry/:id', async (req, res) => {
    const model = await Country.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  })
  // 查
  router.get('/tag/country', async (req, res) => {
    let num = parseInt(req.query.pageNum) || 1;
    let size = parseInt(req.query.pageSize) || 6;
    num--;
    const skipSum = size * num;

    const total = await Country.find().countDocuments();
    const items = await Country.find().skip(skipSum).limit(size);
    res.send({
      items: items,
      total: total
    });
  })
  // 查详情
  router.get('/tag/country/:id', async (req, res) => {
    const item = await Country.findById(req.params.id);
    res.send(item);
  })

  // style
  // 增
  router.post('/tag/addStyle', async (req, res) => {
    const model = await Style.create(req.body);
    res.send(model);
  });
  // 删
  router.delete('/tag/deleteStyle/:id', async (req, res) => {
    await Style.findByIdAndDelete(req.params.id);
    res.send({
      success: true
    });
  });
  // 改
  router.put('/tag/updateStyle/:id', async (req, res) => {
    const model = await Style.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  })
  // 查
  router.get('/tag/style', async (req, res) => {
    const items = await Style.find();
    res.send(items);
  })
  // 查详情
  router.get('/tag/style/:id', async (req, res) => {
    const item = await Style.findById(req.params.id);
    res.send(item);
  })

  // singer
  // 增
  router.post('/addSinger', async (req, res) => {
    const model = await Singer.create(req.body);
    res.send(model);
  });
  // 删
  router.delete('/deleteSinger/:id', async (req, res) => {
    await Singer.findByIdAndDelete(req.params.id);
    res.send({
      success: true
    });
  });
  // 改
  router.put('/updateSinger/:id', async (req, res) => {
    const model = await Singer.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  })
  // 查(分页查询) (关键字查询)
  router.get('/singer', async (req, res) => {
    let key = req.query.key || '';  // 关键字
    let searchObj = null;
    if (key) {
      searchObj = { "name": {$regex: key, $options:'i'} };   // 使用正则 模糊查询
    }

    let numb = parseInt(req.query.pageNum) || 1;   // 第几页
    let size = parseInt(req.query.pageSize) || 6;  // 一页几条数据
    numb--;
    const sum = numb * size;  // 跳过几条数据  (页数-1)*条数
    
    const count = await Singer.find(searchObj).countDocuments();
    const items = await Singer.find(searchObj).populate('country style').skip(sum).limit(size);
    res.send({
      count: count,
      singers: items
    });
  })
  // 查详情
  router.get('/singer/:id', async (req, res) => {
    const item = await Singer.findById(req.params.id);
    res.send(item);
  })


  // 专辑 Album
  // 增
  router.post('/addAlbum', async (req, res) => {
    const model = await Album.create(req.body);
    res.send(model);
  });
  // 删
  router.delete('/deleteAlbum/:id', async (req, res) => {
    await Album.findByIdAndDelete(req.params.id);
    res.send({
      success: true
    });
  });
  // 改
  router.put('/updateAlbum/:id', async (req, res) => {
    const model = await Album.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  })
  // 查(分页查询) (关键字查询)
  router.get('/album', async (req, res) => {
    let key = req.query.key || '';  // 关键字
    let searchObj = null;
    if (key) {
      searchObj = { "name": {$regex: key, $options:'i'} };   // 使用正则 模糊查询
    }

    let numb = parseInt(req.query.pageNum) || 1;   // 第几页
    let size = parseInt(req.query.pageSize) || 6;  // 一页几条数据
    numb--;
    const sum = numb * size;  // 跳过几条数据  (页数-1)*条数
    
    const count = await Album.find(searchObj).countDocuments();
    const items = await Album.find(searchObj).populate('singer style').skip(sum).limit(size);
    res.send({
      count: count,
      albums: items
    });
  })
  // 查详情
  router.get('/album/:id', async (req, res) => {
    const item = await Album.findById(req.params.id);
    res.send(item);
  })

  // 图片上传   multer
  const upload = multer({ dest: 'uploads/' });
  router.post('/upload', upload.single('img'), (req, res) => {
    // 直接把图片对应的路径返回给前端
    res.send('http://localhost:8888/uploads/'+req.file.filename);
  });



  // Music
  // 增
  router.post('/addMusic', async (req, res) => {
    const model = await Music.create(req.body);
    res.send(model);
  });
  // 删
  router.delete('/deleteMusic/:id', async (req, res) => {
    await Music.findByIdAndDelete(req.params.id);
    res.send({
      success: true
    });
  });
  // 改
  router.put('/updateMusic/:id', async (req, res) => {
    const model = await Music.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  })
  // 查(分页查询) (关键字查询)
  router.get('/music', async (req, res) => {
    let key = req.query.key || '';  // 关键字
    let searchObj = null;
    if (key) {
      searchObj = { "name": {$regex: key, $options:'i'} };   // 使用正则 模糊查询
    }

    let numb = parseInt(req.query.pageNum) || 1;   // 第几页
    let size = parseInt(req.query.pageSize) || 4;  // 一页几条数据
    numb--;
    const sum = numb * size;  // 跳过几条数据  (页数-1)*条数
    
    const count = await Music.find(searchObj).countDocuments();
    const items = await Music.find(searchObj).populate('singer album').skip(sum).limit(size);
    res.send({
      count: count,
      musics: items
    });
  })
  // 查详情
  router.get('/music/:id', async (req, res) => {
    const item = await Music.findById(req.params.id);
    res.send(item);
  })

  // 音乐上传
  const musicUP = multer({ dest: 'musics/' });
  router.post('/uploadMusic', musicUP.single('music'), (req, res) => {
    // 直接把音乐对应路径返回
    res.send({
      name: req.file.originalname,
      path: 'http://localhost:8888/uploadMusic/'+req.file.filename
    });
  });


  // admin
  // 查
  router.get('/adminList', async (req, res) => {
    const model = await Admin.find();
    res.send(model);
  });
  // 增 （只有超级管理员能增）
  router.post('/addAdmin', async (req, res) => {
    const user = await Admin.findById(req.body.AdminID);
    if (user.type === 'root') {
      const model = await Admin.create(req.body);
      res.send(model);
    } else {
      res.send('只有超级管理员可以添加管理员');
    }
  });
  // 删 （只有超级管理员能删）
  router.delete('/deleteAdmin/:id', async (req, res) => {
    // await Admin.findByIdAndDelete(req.params.id);
    res.send('删除成功');
  });
  // 改 （只有超级管理员能改）
  router.put('/updateAdmin/:id', async (req, res) => {
    res.send('修改成功');
  });


  // 校验用户是否已经登录的中间件
  const auth = async (req, res, next) => {
    // 通过前端发送来的token进行校验
    const token = String(req.headers.authorization || '');
    if (!token) {
      return res.status(401).send({message: '请在登录后进行操作'});  // 没有token
    }
    const { id } = jwt.verify(token, app.get('secret'));  // 获取到加密前的对象
    if (!id) {
      return res.status(401).send({message: '请在登录后进行操作'});  // token无效
    }
    req.user = await Admin.findById(id);
    if (!req.user) {
      return res.status(401).send({message: '请在登录后进行操作'});
    }

    await next();
  }

  app.use('/admin/rest', auth, router);



  // 登录 (登录接口不需要校验token，所以把它单独拿出来)
  app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Admin.findOne({
      username: username
    }).select('+password');
    if (!user) {
      return res.status(442).send({message: '用户不存在'});
    }
    const valid = require('bcrypt').compareSync(password, user.password);
    if (!valid) {
      return res.status(442).send({message: '密码错误'});
    }
    // 发放token
    const token = jwt.sign({ id: user._id }, app.get('secret'));
    res.send({token});
  });


  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
      message: err.message
    })
  })
}