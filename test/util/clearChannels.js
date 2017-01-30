'use strict';

const config = require(process.cwd() + '/config')('testClient');
const include = config.include;

let assert = require('assert');

let models = include('models/mongoose.js');

module.exports = function (done) {
  models.ChannelModel.mongooseModel.remove({})
    .then(() => {
      models.ChannelModel.mongooseModel.find({})
        .exec()
        .then((docs) => {
          assert.equal(0, docs.length);
          done();
        });
    })
    .catch((err) => {
      done(err);
    });
};
