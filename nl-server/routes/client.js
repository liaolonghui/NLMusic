module.exports = app => {
  const router = require('express').Router();
  const Album = require('../models/Album');
  const Music = require('../models/Music');
  const Style = require('../models/Style');
  const Singer = require('../models/Singer')
  const MV = require('../models/MV')

  // albums
  // 获取专辑
  router.get('/albumList', async (req, res) => {
    let searchObj = null; // 搜索
    let options = null;   // populate关联查询
    const name = req.query.name;
    if (name) {
      searchObj = {
        "name": { $regex: name, $options: 'i' }
      };
      options = {
        populate: "singer style"
      };
    }
    const items = await Album.find(searchObj).setOptions(options).sort({ time: -1 });
    res.send(items)
  })
  // 根据歌手id搜索
  router.get('/albumList/:id', async (req, res) => {
    const items = await Album.find({
      singer: req.params.id
    })
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
  router.get('/musicList', async (req, res) => {
    let searchObj = null; // 搜索
    let options = null;   // populate关联查询
    const name = req.query.name;
    if (name) {
      searchObj = {
        "name": { $regex: name, $options: 'i' }
      };
      options = {
        populate: "singer album"
      };
    }
    const items = await Music.find(searchObj).setOptions(options)
    res.send(items)
  })


  // singers
  router.get('/singerList', async (req, res) => {
    let searchObj = null; // 搜索
    let options = null;   // populate关联查询
    const name = req.query.name;
    if (name) {
      searchObj = {
        "name": { $regex: name, $options: 'i' }
      };
      options = {
        populate: "style country"
      };
    }
    const items = await Singer.find(searchObj).setOptions(options)
    res.send(items)
  })
  router.get('/singer/:id', async (req, res) => {
    const item = await Singer.findById(req.params.id).populate('style country');
    res.send(item);
  })


  // mv
  router.get('/mvList', async (req, res) => {
    const models = await MV.find();
    res.send(models);
  });
  router.get('/mv/:id', async (req, res) => {
    const model = await MV.findById(req.params.id);
    res.send(model);
  });



  // 排行榜
  router.get('/Top', async (req, res) => {
    const musics = await Music.find().sort({love: -1}).populate('singer album').limit(10)
    const albums = await Album.find().sort({love: -1}).limit(10)
    const singers = await Singer.find().sort({love: -1}).limit(10)
    res.send({
      musics,
      albums,
      singers
    })
  })


  app.use('/client', router);

}