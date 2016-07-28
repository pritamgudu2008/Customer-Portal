'use strict';

// Setting up route
angular.module('feedbacks').config(['$stateProvider',
  function ($stateProvider) {
    // Feedbacks state routing
    $stateProvider
      .state('feedbacks', {
        abstract: true,
        url: '/feedbacks',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('feedbacks.list', {
        url: '',
        templateUrl: 'modules/feedbacks/views/list-feedbacks.client.view.html'
      })
      .state('feedbacks.create', {
        url: '/create',
        templateUrl: 'modules/feedbacks/views/create-feedback.client.view.html'
      })
      .state('feedbacks.view', {
        url: '/:feedbackId',
        templateUrl: 'modules/feedbacks/views/view-feedback.client.view.html'
      })
      .state('feedbacks.edit', {
        url: '/:feedbackId/edit',
        templateUrl: 'modules/feedbacks/views/edit-feedback.client.view.html'
      });
  }
]);
