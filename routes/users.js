'use strict';

var express = require('express');
var router = express.Router();
var UserController = include('controllers/UserController.js');

router.get('/', UserController.list);
router.get('/:id', UserController.show);
router.post('/', UserController.register);
router.post('/login', UserController.login);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);

router.all('/*', (req, res) => {
  return res.status(403)
    .json({
      'message': 'unknown url'
    });
});

module.exports = router;
