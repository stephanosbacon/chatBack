'use strict';
var x = {
  name: 'bob',
  getName: function () {
    console.log(this.name);
    return this.name;
  }
};

var y = {
  name: 'jill',
  getName: x.getName,
  getName1: function () {
    return x.getName();
  }
};

//console.log(x.getName());
console.log(y.getName());
console.log(y.getName1());
