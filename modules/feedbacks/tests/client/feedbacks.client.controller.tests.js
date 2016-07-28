'use strict';

(function () {
  // Feedbacks Controller Spec
  describe('Feedbacks Controller Tests', function () {
    // Initialize global variables
    var FeedbacksController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Feedbacks,
      mockFeedback;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Feedbacks_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Feedbacks = _Feedbacks_;

      // create mock feedback
      mockFeedback = new Feedbacks({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Feedback about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Feedbacks controller.
      FeedbacksController = $controller('FeedbacksController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one feedback object fetched from XHR', inject(function (Feedbacks) {
      // Create a sample feedbacks array that includes the new feedback
      var sampleFeedbacks = [mockFeedback];

      // Set GET response
      $httpBackend.expectGET('api/feedbacks').respond(sampleFeedbacks);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.feedbacks).toEqualData(sampleFeedbacks);
    }));

    it('$scope.findOne() should create an array with one feedback object fetched from XHR using a feedbackId URL parameter', inject(function (Feedbacks) {
      // Set the URL parameter
      $stateParams.feedbackId = mockFeedback._id;

      // Set GET response
      $httpBackend.expectGET(/api\/feedbacks\/([0-9a-fA-F]{24})$/).respond(mockFeedback);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.feedback).toEqualData(mockFeedback);
    }));

    describe('$scope.craete()', function () {
      var sampleFeedbackPostData;

      beforeEach(function () {
        // Create a sample feedback object
        sampleFeedbackPostData = new Feedbacks({
          title: 'An Feedback about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Feedback about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Feedbacks) {
        // Set POST response
        $httpBackend.expectPOST('api/feedbacks', sampleFeedbackPostData).respond(mockFeedback);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the feedback was created
        expect($location.path.calls.mostRecent().args[0]).toBe('feedbacks/' + mockFeedback._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/feedbacks', sampleFeedbackPostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock feedback in scope
        scope.feedback = mockFeedback;
      });

      it('should update a valid feedback', inject(function (Feedbacks) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/feedbacks\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/feedbacks/' + mockFeedback._id);
      }));

      it('should set scope.error to error response message', inject(function (Feedbacks) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/feedbacks\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(feedback)', function () {
      beforeEach(function () {
        // Create new feedbacks array and include the feedback
        scope.feedbacks = [mockFeedback, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/feedbacks\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockFeedback);
      });

      it('should send a DELETE request with a valid feedbackId and remove the feedback from the scope', inject(function (Feedbacks) {
        expect(scope.feedbacks.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.feedback = mockFeedback;

        $httpBackend.expectDELETE(/api\/feedbacks\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to feedbacks', function () {
        expect($location.path).toHaveBeenCalledWith('feedbacks');
      });
    });
  });
}());
