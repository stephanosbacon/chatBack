'use strict';

let Status = include('util/status.js');

module.exports = function (_res, _cb) {
  let cb = _cb;
  let res = _res;
  return function (err, obj) {
    if (err) {
      res.status(500)
        .json(new Status(500, 'Error getting or saving object', err))
        .end();
    } else if (!obj) {
      res.status(404)
        .json(new Status(404, 'No such object'))
        .end();
    } else {
      cb(obj);
    }
  };
};
