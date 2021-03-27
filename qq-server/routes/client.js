module.exports = app => {
  const router = require('express').Router();
  const Album = require('../models/Album');
  const Music = require('../models/Music');

  router.get('/albums', async (req, res) => {
    const model = await Album.find().sort({time: -1}).limit(10);
    res.send(model);
  });
  router.get('/album/:id', async (req, res) => {
    // 获取专辑所含歌曲信息
    const item = await Music.find({
      album: req.params.id
    }).populate('album singer');
    res.send(item)
  })


  app.use('/client', router);

}