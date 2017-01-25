'use strict';

function Status(code, message, errObj) {
  if (errObj === undefined) {
    errObj = null;
  }
  this.code = code;
  this.message = message;
  this.err = errObj;
}

module.exports = Status;
