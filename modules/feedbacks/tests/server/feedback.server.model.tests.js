'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Feedback = mongoose.model('Feedback');

/**
 * Globals
 */
var user, feedback;

/**
 * Unit tests
 */
describe('Feedback Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      feedback = new Feedback({
        title: 'Feedback Title',
        content: 'Feedback Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return feedback.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      feedback.title = '';

      return feedback.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Feedback.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
