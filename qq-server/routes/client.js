module.exports = app => {
  const router = require('express').Router();

  router.get('/', async (req, res) => {
    res.send('....');
  });


  app.use('/client', router);

}