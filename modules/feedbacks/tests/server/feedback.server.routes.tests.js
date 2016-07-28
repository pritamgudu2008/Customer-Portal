'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Feedback = mongoose.model('Feedback'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, feedback;

/**
 * Feedback routes tests
 */
describe('Feedback CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new feedback
    user.save(function () {
      feedback = {
        title: 'Feedback Title',
        content: 'Feedback Content'
      };

      done();
    });
  });

  it('should be able to save an feedback if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(200)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Handle feedback save error
            if (feedbackSaveErr) {
              return done(feedbackSaveErr);
            }

            // Get a list of feedbacks
            agent.get('/api/feedbacks')
              .end(function (feedbacksGetErr, feedbacksGetRes) {
                // Handle feedback save error
                if (feedbacksGetErr) {
                  return done(feedbacksGetErr);
                }

                // Get feedbacks list
                var feedbacks = feedbacksGetRes.body;

                // Set assertions
                (feedbacks[0].user._id).should.equal(userId);
                (feedbacks[0].title).should.match('Feedback Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an feedback if not logged in', function (done) {
    agent.post('/api/feedbacks')
      .send(feedback)
      .expect(403)
      .end(function (feedbackSaveErr, feedbackSaveRes) {
        // Call the assertion callback
        done(feedbackSaveErr);
      });
  });

  it('should not be able to save an feedback if no title is provided', function (done) {
    // Invalidate title field
    feedback.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(400)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Set message assertion
            (feedbackSaveRes.body.message).should.match('Title cannot be blank');

            // Handle feedback save error
            done(feedbackSaveErr);
          });
      });
  });

  it('should be able to update an feedback if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(200)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Handle feedback save error
            if (feedbackSaveErr) {
              return done(feedbackSaveErr);
            }

            // Update feedback title
            feedback.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing feedback
            agent.put('/api/feedbacks/' + feedbackSaveRes.body._id)
              .send(feedback)
              .expect(200)
              .end(function (feedbackUpdateErr, feedbackUpdateRes) {
                // Handle feedback update error
                if (feedbackUpdateErr) {
                  return done(feedbackUpdateErr);
                }

                // Set assertions
                (feedbackUpdateRes.body._id).should.equal(feedbackSaveRes.body._id);
                (feedbackUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of feedbacks if not signed in', function (done) {
    // Create new feedback model instance
    var feedbackObj = new Feedback(feedback);

    // Save the feedback
    feedbackObj.save(function () {
      // Request feedbacks
      request(app).get('/api/feedbacks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single feedback if not signed in', function (done) {
    // Create new feedback model instance
    var feedbackObj = new Feedback(feedback);

    // Save the feedback
    feedbackObj.save(function () {
      request(app).get('/api/feedbacks/' + feedbackObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', feedback.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single feedback with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/feedbacks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Feedback is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single feedback which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent feedback
    request(app).get('/api/feedbacks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No feedback with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an feedback if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new feedback
        agent.post('/api/feedbacks')
          .send(feedback)
          .expect(200)
          .end(function (feedbackSaveErr, feedbackSaveRes) {
            // Handle feedback save error
            if (feedbackSaveErr) {
              return done(feedbackSaveErr);
            }

            // Delete an existing feedback
            agent.delete('/api/feedbacks/' + feedbackSaveRes.body._id)
              .send(feedback)
              .expect(200)
              .end(function (feedbackDeleteErr, feedbackDeleteRes) {
                // Handle feedback error error
                if (feedbackDeleteErr) {
                  return done(feedbackDeleteErr);
                }

                // Set assertions
                (feedbackDeleteRes.body._id).should.equal(feedbackSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an feedback if not signed in', function (done) {
    // Set feedback user
    feedback.user = user;

    // Create new feedback model instance
    var feedbackObj = new Feedback(feedback);

    // Save the feedback
    feedbackObj.save(function () {
      // Try deleting feedback
      request(app).delete('/api/feedbacks/' + feedbackObj._id)
        .expect(403)
        .end(function (feedbackDeleteErr, feedbackDeleteRes) {
          // Set message assertion
          (feedbackDeleteRes.body.message).should.match('User is not authorized');

          // Handle feedback error error
          done(feedbackDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Feedback.remove().exec(done);
    });
  });
});
