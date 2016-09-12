'use strict';

// Customers controller

//noinspection JSAnnotator
var customerApp = angular.module('customers');

customerApp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log', '$filter', 'Notify',
  function ($scope, $stateParams, Authentication, Customers, $modal, $log, $filter, Notify) {


      this.authentication = Authentication;
    
      // Find a list of Customers
      this.customers = Customers.query();
    
      this.pager = function(customers){
          
         Customers.query(function (data) {
            $scope.customerrecords = data;

          $scope.buildPager = function () {
          $scope.pagedItems = [];
          $scope.itemsPerPage = 6;
          $scope.currentPage = 1;
          $scope.figureOutItemsToDisplay();
        };

        $scope.figureOutItemsToDisplay = function () {
          $scope.filteredItems = $filter('filter')($scope.customerrecords, {
            $: $scope.searchText
          });
          $scope.filterLength = $scope.filteredItems.length;
          var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
          var end = begin + $scope.itemsPerPage;
          $scope.pagedItems = $scope.filteredItems.slice(begin, end);
        };

        $scope.pageChanged = function () {
          $scope.figureOutItemsToDisplay();
        };
            $scope.buildPager();
        });
      };

      this.pager(this.customers);

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
              $scope.customer = angular.copy(customer);

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

      //Model Window to View a single customer

      this.modalView = function (size, selectedCustomer) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/customers/views/customer-details.client.view.html',
          controller: function ($scope, $modalInstance, customer) {
              $scope.customer = angular.copy(customer);

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
                  Notify.sendMsg('DeleteCustomer', {'id':customer._id});
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

        
        $scope.maxDate = new Date();
        $scope.minDate = new Date(1900, 1, 1);

        $scope.open = function($event) {
          $scope.status.opened = true;
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          
          startingDay: 1
        };

        $scope.format = 'dd-MMM-yyyy';

        $scope.status = {
          opened: false
        };
    }
]);


customerApp.controller('CustomersUpdateController', ['$scope', 'Customers', 'Notify',
  function ($scope, Customers, Notify) {

      // Update existing Customer
      this.update = function (updatedCustomer) {
          var customer = angular.copy(updatedCustomer);

          customer.$update(function (response) {
              Notify.sendMsg('UpdateCustomer', {'id':response._id});
              console.log('Now calling the Update Method');
          }, function (errorResponse) {
              $scope.error = errorResponse.data.message;
          });
      };
      
      
        $scope.maxDate = new Date();
        $scope.minDate = new Date(1900, 1, 1);

        $scope.open = function($event) {
          $scope.status.opened = true;
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          
          startingDay: 1
        };

        $scope.format = 'dd-MMM-yyyy';

        $scope.status = {
          opened: false
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
                scope.customersCtrl.pager(Customers.query());
                //scope.customersCtrl.customers = Customers.query();
            });
            Notify.getMsg('UpdateCustomer', function (event, data) {
                scope.customersCtrl.pager(Customers.query());
                //scope.customersCtrl.customers = Customers.query();
            });
            Notify.getMsg('DeleteCustomer', function (event, data) {
                scope.customersCtrl.pager(Customers.query());
                //scope.customersCtrl.customers = Customers.query();
            });
        }
    };
}]);

