"use strict";

var express = require('express');
var router = express.Router();

var ChannelController = include('controllers/ChannelController.js');

router.get('/', ChannelController.list);
router.get('/:id/messages', ChannelController.showMessages);
router.get('/:id/users', ChannelController.showUsers);
router.get("/foruser/:userid", ChannelController.showChannelsForUser);
router.post('/', ChannelController.create);
router.post('/:id/messages', ChannelController.newMessage);
router.put("/:id/users/:userid", ChannelController.addUser);
router.delete('/:id', ChannelController.remove);

router.all('/*', (req, res) => {
  return res.status(403)
    .json({
      'message': 'unknown url'
    });
});


module.exports = router;
