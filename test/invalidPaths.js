"use strict";

var request = require('supertest');
var should = require('should');
var express = require('express');
var assert = require('assert');
var models = require('../models/mongoose.js');


var request = request('https://localhost:3000');

describe('Test invalid urls', function () {
  it('empty path', function (done) {
    request.get('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');

      })
      .end((err, res) => {
        done(err)
      });
  });
  it('empty path', function (done) {
    request.put('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
  it('empty path', function (done) {
    request.post('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
  it('invalid path', function (done) {
    request.get('/api/foo')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');

      })
      .end((err, res) => {
        done(err)
      });
  });
  it('invalid path', function (done) {
    request.put('/flubber')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
  it('invalid path', function (done) {
    request.post('/flee/floo/flim/api/channels')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
});
