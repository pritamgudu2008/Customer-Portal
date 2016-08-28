'use strict';

var App = angular.module('core');
App.controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.myInterval = 6000;
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

App.controller('FeedCtrl', ['$scope','FeedService', function ($scope,Feed) {    
    $scope.feedSrc='http://rss.cnn.com/rss/cnn_topstories.rss';
    $scope.loadFeed=function(){        
        Feed.parseFeed($scope.feedSrc).then(function(res){
            //$scope.loadButonText=angular.element(e.target).text();
            $scope.feeds=res.data.responseData.feed.entries;
        });
    };
    $scope.loadFeed();
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
}]);

App.factory('FeedService',['$http',function($http){
    return {
        parseFeed : function(url){
            return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=20&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
        }
    };
}]);
