'use strict';

// Feedbacks controller
angular.module('feedbacks').controller('FeedbacksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Feedbacks',
  function ($scope, $stateParams, $location, Authentication, Feedbacks) {
    $scope.authentication = Authentication;

    // Create new Feedback
    $scope.create = function () {
      // Create new Feedback object
      var feedback = new Feedbacks({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      feedback.$save(function (response) {
        $location.path('feedbacks/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Feedback
    $scope.remove = function (feedback) {
      if (feedback) {
        feedback.$remove();

        for (var i in $scope.feedbacks) {
          if ($scope.feedbacks[i] === feedback) {
            $scope.feedbacks.splice(i, 1);
          }
        }
      } else {
        $scope.feedback.$remove(function () {
          $location.path('feedbacks');
        });
      }
    };

    // Update existing Feedback
    $scope.update = function () {
      var feedback = $scope.feedback;

      feedback.$update(function () {
        $location.path('feedbacks/' + feedback._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Feedbacks
    $scope.find = function () {
      $scope.feedbacks = Feedbacks.query();
    };

    // Find existing Feedback
    $scope.findOne = function () {
      $scope.feedback = Feedbacks.get({
        feedbackId: $stateParams.feedbackId
      });
    };
  }
]);
