'use strict';

/* IIFE */
/* Don't pollute the global scope! */
(function(){
  angular.module('app')
         .controller('SearchController', ['$scope', '$q', 'Restaurant', 'Neighborhood', SearchController]);

  function SearchController($scope, $q, Restaurant, Neighborhood){
    /* Container for storing data from GET request. */
    $scope.data = {};
    /* List is ordered based on most locations for each restaurant chain. */
    $scope.sort = '-TotalLocations';
    /* Holds filtering options for dynamically switching ng-repeat filter. */
    $scope.sortOptions = {
      TotalLocations: false,
      PoorestRating: true,
      TotalEvalsLastWeek: true,
      TotalEvals: true
    };
    /* Change sorting option. */
    $scope.changeSortTo = function(option){
      _.forEach($scope.sortOptions, function(value, key){
        (key === option) ? ($scope.sortOptions[key] = false) : ($scope.sortOptions[key] = true);
      });

      /* Prepending '-' denotes descending order. */
      switch(option){
        case 'TotalLocations':
        case 'TotalEvalsLastWeek':
        case 'TotalEvals':
          $scope.sort = '-' + option;
          break;
        default:
          $scope.sort = option;
          break;
      }
    };

    /* Handle logic for multiple "pages" on SPA. */
    $scope.currentPage = 0;
    $scope.pageSize = 25;
    $scope.numberOfPages = function(){
      return (typeof($scope.data.restaurants) !== 'undefined') ? Math.ceil($scope.data.restaurants.length / $scope.pageSize) : 'Unknown';
    };

    $q.all([
      Restaurant.query().$promise,
      Neighborhood.query().$promise
    ]).then(function(result){
      // console.log('Result', result);
      $scope.data.restaurants = result[0].Restaurants;
      $scope.data.geoNeighborhoods = result[1];
    });
  };
}());
