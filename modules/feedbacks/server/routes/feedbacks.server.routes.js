'use strict';

/**
 * Module dependencies.
 */
var feedbacksPolicy = require('../policies/feedbacks.server.policy'),
  feedbacks = require('../controllers/feedbacks.server.controller');

module.exports = function (app) {
  // Feedbacks collection routes
  app.route('/api/feedbacks').all(feedbacksPolicy.isAllowed)
    .get(feedbacks.list)
    .post(feedbacks.create);

  // Single feedback routes
  app.route('/api/feedbacks/:feedbackId').all(feedbacksPolicy.isAllowed)
    .get(feedbacks.read)
    .put(feedbacks.update)
    .delete(feedbacks.delete);

  // Finish by binding the feedback middleware
  app.param('feedbackId', feedbacks.feedbackByID);
};
