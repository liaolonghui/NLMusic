module.exports = app => {
  const router = require('express').Router();
  const Album = require('../models/Album')

  router.get('/albums', async (req, res) => {
    const model = await Album.find().limit(10);
    res.send(model);
  });


  app.use('/client', router);

}