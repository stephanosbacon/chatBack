var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    UserController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    UserController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    UserController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    UserController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    UserController.remove(req, res);
});

/**
 * catch-all
 */
router.all('/*', function (req, res) {
    return res.status(403).json({'message': 'unknown url'});
});


module.exports = router;