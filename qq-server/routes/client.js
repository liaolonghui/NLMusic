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
    const items = await Music.find({
      album: req.params.id
    }).populate('album style singer');
    // 获取专辑的流派
    const { style } = await Album.findById(req.params.id).populate('style');
    items[0].album.style = style;
    res.send(items)
  })


  app.use('/client', router);

}