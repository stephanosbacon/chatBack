'use strict';

let config = require(process.cwd() + '/config')('testClient');

let request = require('supertest');
let assert = require('assert');

let req = request(config.serverUrl);

describe('Test invalid urls', function () {
  it('empty path', function (done) {
    req.get('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');

      })
      .end((err) => {
        done(err);
      });
  });
  it('empty path', function (done) {
    req.put('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err) => {
        done(err);
      });
  });
  it('empty path', function (done) {
    req.post('/')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err) => {
        done(err);
      });
  });
  it('invalid path', function (done) {
    req.get('/api/foo')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');

      })
      .end((err) => {
        done(err);
      });
  });
  it('invalid path', function (done) {
    req.put('/flubber')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err) => {
        done(err);
      });
  });
  it('invalid path', function (done) {
    req.post('/flee/floo/flim/api/channels')
      .expect(403)
      .expect((res) => {
        assert.equal(res.body.message, 'unknown url');
      })
      .end((err) => {
        done(err);
      });
  });
});
