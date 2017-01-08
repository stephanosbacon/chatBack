'use strict';

module.exports = function (_res, _cb) {
  let cb = _cb;
  let res = _res;
  return function (err, obj) {
    if (err) {
      res.status(500)
        .json({
          'message': 'Error getting or saving object',
          'err': err
        })
        .end();
    } else if (!obj) {
      res.status(404)
        .json({
          'message': 'No such object'
        })
        .end();
    } else {
      cb(obj);
    }
  }
};
