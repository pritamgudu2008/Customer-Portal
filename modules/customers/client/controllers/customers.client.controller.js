'use strict';

// Customers controller

//noinspection JSAnnotator
var customerApp = angular.module('customers');

customerApp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log',
  function ($scope, $stateParams, Authentication, Customers, $modal, $log) {


      this.authentication = Authentication;
    
      // Find a list of Customers
      this.customers = Customers.query();

      //Model Window to create a single customer
      this.animationsEnabled = true;

      this.modalCreate = function (size) {

          var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/customers/views/create-customer.client.view.html',
              controller: function ($scope, $modalInstance) {

                  $scope.ok = function (isValid) {
                      $modalInstance.close();
                  };

                  $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                  };
              },
              size: size
          });

          modalInstance.result.then(function (selectedItem) {
          }, function () {
              $log.info('Modal dismissed at: ' + new Date());
          });
      };

      this.toggleAnimation = function () {
          $scope.animationsEnabled = !$scope.animationsEnabled;
      };

      //Model Window to update a single customer

      this.modalUpdate = function (size, selectedCustomer) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/customers/views/edit-customer.client.view.html',
          controller: function ($scope, $modalInstance, customer) {
              $scope.customer = customer;

              $scope.ok = function (isValid) {
                  $modalInstance.close($scope.customer);
              };

              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
              };
          },
          size: size,
          resolve: {
            customer: function () {
              return selectedCustomer;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };


      // Remove existing Customer
      this.remove = function (customer) {
          if (customer) {
              customer.$remove();

              for (var i in this.customers) {
                  if (this.customers[i] === customer) {
                      this.customers.splice(i, 1);
                  }
              }
          } else {
              this.customer.$remove(function () {
              });
          }
      };

    }
]);


customerApp.controller('CustomersCreateController', ['$scope', 'Customers','Notify',
  function ($scope, Customers, Notify) {


      // Create new Customer
      this.create = function () {
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

              Notify.sendMsg('NewCustomer', {'id':response._id});
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };
    }
]);


customerApp.controller('CustomersUpdateController', ['$scope', 'Customers',
  function ($scope, Customers) {

      // Update existing Customer
      this.update = function (updatedCustomer) {
          var customer = updatedCustomer;

          customer.$update(function () {
              console.log('Now calling the Update Method');
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };

    }
]);

customerApp.directive('customerList', ['Customers', 'Notify', function (Customers, Notify) {
    return{
        restrict:'E',
        transclude:'true',
        templateUrl:'modules/customers/views/view-customer.client.view.html',
        link: function (scope, element, attrs) {

            //When a new customer is added,update the customer list

            Notify.getMsg('NewCustomer', function (event, data) {
                scope.customersCtrl.customers = Customers.query();
            });
        }
    };
}]);

