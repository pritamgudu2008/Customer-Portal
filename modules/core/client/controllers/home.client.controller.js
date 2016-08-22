'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.myInterval = 8000;
	$scope.noWrapSlides = false;
	$scope.slides = [
	    {
	      image:'modules/core/img/brand/insurance-arrow.jpg',
	      text:'Insurance is a means of protection from financial loss'
	    },
	    {
	      image:'modules/core/img/brand/Insurance policy.jpg',
	      text:'Image 2'
	    },
	    {
	      image:'modules/core/img/brand/Health Insurance policy.jpg',
	      text:'Image 3'
	    },
	    {
	      image:'modules/core/img/brand/insurance.jpg',
	      text:'Image 4'
	    },
	    {
	      image:'modules/core/img/brand/Home Insurance.jpg',
	      text:'Image 5'
	    },
	    {
	      image:'modules/core/img/brand/Insurance1.jpg',
	      text:'Image 6'
	    }];
  }
]);
