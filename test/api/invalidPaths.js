"use strict";

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

let request = require('supertest');
let should = require('should');
let express = require('express');
let assert = require('assert');


let models = include('models/mongoose.js');


let req = request(config.serverUrl);

describe('Test invalid urls', function () {
  it('empty path', function (done) {
    req.get('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');

      })
      .end((err, res) => {
        done(err)
      });
  });
  it('empty path', function (done) {
    req.put('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
  it('empty path', function (done) {
    req.post('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
  it('invalid path', function (done) {
    req.get('/api/foo')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');

      })
      .end((err, res) => {
        done(err)
      });
  });
  it('invalid path', function (done) {
    req.put('/flubber')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
  it('invalid path', function (done) {
    req.post('/flee/floo/flim/api/channels')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err, res) => {
        done(err)
      });
  });
});
