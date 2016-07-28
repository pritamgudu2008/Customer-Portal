'use strict';

// Customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers',
  function ($scope, $stateParams, $location, Authentication, Customers) {
    $scope.authentication = Authentication;

    // Create new Customer
    $scope.create = function () {
      // Create new Customer object
      var customer = new Customers({
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        gender: this.gender,
        dateOfBirth: this.dateOfBirth,
        phoneNumber: this.phoneNumber,
        emailId: this.emailId,
        maritalStatus: this.maritalStatus,
        language: this.language,
        address: this.address,
        postalCode: this.postalCode,
        policyNumber: this.policyNumber
      });

      // Redirect after save
      customer.$save(function (response) {
        $location.path('customers/' + response._id);

        // Clear form fields
        $scope.firstName = '';
        $scope.middleName = '';
        $scope.lastName = '';
        $scope.gender = '';
        $scope.dateOfBirth = '';
        $scope.phoneNumber = '';
        $scope.emailId = '';
        $scope.maritalStatus = '';
        $scope.language = '';
        $scope.address = '';
        $scope.postalCode = '';
        $scope.policyNumber = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Customer
    $scope.remove = function (customer) {
      if (customer) {
        customer.$remove();

        for (var i in $scope.customers) {
          if ($scope.customers[i] === customer) {
            $scope.customers.splice(i, 1);
          }
        }
      } else {
        $scope.customer.$remove(function () {
          $location.path('customers');
        });
      }
    };

    // Update existing Customer
    $scope.update = function () {
      var customer = $scope.customer;

      customer.$update(function () {
        $location.path('customers/' + customer._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Customers
    $scope.find = function () {
      $scope.customers = Customers.query();
    };

    // Find existing Customer
    $scope.findOne = function () {
      $scope.customer = Customers.get({
        customerId: $stateParams.customerId
      });
    };
  }
]);
