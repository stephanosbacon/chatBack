"use strict";

var express = require('express');
var router = express.Router();
var ChannelController = require('../controllers/ChannelController.js');

/*
 * GET
 */
router.get('/', function (req, res) {
  ChannelController.list(req, res);
});

/*
 * GET
 */
router.get('/:id/messages', function (req, res) {
  ChannelController.showMessages(req, res);
});

router.get('/:id/users', function (req, res) {
  ChannelController.showUsers(req, res);
});

router.get("/foruser/:userid", function (req, res) {
  ChannelController.showChannelsForUser(req, res);
});

/*
 * POST
 */
router.post('/', function (req, res) {
  ChannelController.create(req, res);
});

router.post('/:id/messages', function (req, res) {
  ChannelController.newMessage(req, res);
});

/*
 * PUT
 */
router.put("/:id/users/:userid", function (req, res) {
  ChannelController.addUser(req, res);
});


/*
 * DELETE
 */
router.delete('/:id', function (req, res) {
  ChannelController.remove(req, res);
});

/**
 * catch-all
 */
router.all('/*', function (req, res) {
  return res.status(403).json({'message': 'unknown url'});
});

module.exports = router;