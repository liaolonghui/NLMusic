module.exports = app => {
  const router = require('express').Router({
    mergeParams: true
  });
  const Country = require('../models/Country');
  const Style = require('../models/Style');
  const Singer = require('../models/Singer');
  const Album = require('../models/Album')

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


  app.use('/admin', router);

}