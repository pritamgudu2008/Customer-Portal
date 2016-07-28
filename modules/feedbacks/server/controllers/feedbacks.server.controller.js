'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Feedback = mongoose.model('Feedback'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a feedback
 */
exports.create = function (req, res) {
  var feedback = new Feedback(req.body);
  feedback.user = req.user;

  feedback.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feedback);
    }
  });
};

/**
 * Show the current feedback
 */
exports.read = function (req, res) {
  res.json(req.feedback);
};

/**
 * Update a feedback
 */
exports.update = function (req, res) {
  var feedback = req.feedback;

  feedback.title = req.body.title;
  feedback.content = req.body.content;

  feedback.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feedback);
    }
  });
};

/**
 * Delete an feedback
 */
exports.delete = function (req, res) {
  var feedback = req.feedback;

  feedback.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feedback);
    }
  });
};

/**
 * List of Feedbacks
 */
exports.list = function (req, res) {
  Feedback.find().sort('-created').populate('user', 'displayName').exec(function (err, feedbacks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(feedbacks);
    }
  });
};

/**
 * Feedback middleware
 */
exports.feedbackByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Feedback is invalid'
    });
  }

  Feedback.findById(id).populate('user', 'displayName').exec(function (err, feedback) {
    if (err) {
      return next(err);
    } else if (!feedback) {
      return res.status(404).send({
        message: 'No feedback with that identifier has been found'
      });
    }
    req.feedback = feedback;
    next();
  });
};
