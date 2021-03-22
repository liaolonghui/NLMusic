module.exports = app => {
  const router = require('express').Router({
    mergeParams: true
  });
  const Country = require('../models/Country');
  const Style = require('../models/Style');

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
    const items = await Country.find();
    res.send(items);
  })
  // 查详情
  router.get('/tag/country/:id', async (req, res) => {
    const items = await Country.findById(req.params.id);
    res.send(items);
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
    const items = await Style.findById(req.params.id);
    res.send(items);
  })

  app.use('/admin', router);

}