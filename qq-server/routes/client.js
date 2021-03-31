const { query } = require('express');

module.exports = app => {
  const router = require('express').Router();
  const Album = require('../models/Album');
  const Music = require('../models/Music');
  const Style = require('../models/Style');

  // albums
  // 获取全部专辑
  router.get('/albumList', async (req, res) => {
    const items = await Album.find()
    res.send(items)
  })
  // 获取十个指定类型专辑
  router.get('/albums', async (req, res) => {
    // 先从style中查出对应id
    let queryObj = {}
    if ( req.query.style !== '推荐' ) {
      const {_id} = await Style.findOne({
        "name": { $regex: req.query.style }
      })
      queryObj.style = _id
    }
    const model = await Album.find(queryObj).sort({time: -1}).limit(10);
    res.send(model);
  });
  // 获取专辑中所有歌曲
  router.get('/album/:id', async (req, res) => {
    // 获取专辑所含歌曲信息
    const items = await Music.find({
      album: req.params.id
    }).populate('album singer');
    // 获取专辑的流派
    const { style } = await Album.findById(req.params.id).populate('style');
    items[0].album.style = style;
    res.send(items)
  })
  // comment
  router.post('/addComment/:id', async (req, res) => {
    const model = await Album.findByIdAndUpdate(req.params.id, {
      $set: {
        "comments": req.body.comments
      }
    })
    res.status(201).send(model)
  })


  // musics
  router.get('/musics', async (req, res) => {
    const musics = await Music.find().populate('album singer').limit(9)
    res.send(musics)
  })


  app.use('/client', router);

}