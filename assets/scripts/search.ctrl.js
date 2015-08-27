'use strict';
var hello;
/* IIFE */
/* Don't pollute the global scope! */
(function(){
  angular.module('app')
         .controller('SearchController', ['$scope', '$q', 'Restaurant', 'Neighborhood', SearchController]);

  function SearchController($scope, $q, Restaurant, Neighborhood){
    $scope.data = {};

    $q.all([
      Restaurant.query().$promise,
      Neighborhood.query().$promise
    ]).then(function(result){
      console.log('Result', result);
      $scope.data.restaurants = _.values(result[0].Report[0]);
      hello = $scope.data.restaurants;
      $scope.data.geoNeighborhoods = result[1];
      console.log($scope.data.restaurants);
      console.log($scope.data.geoNeighborhoods);
      // categorizeByNeighborhoods();
    });


    // Restaurant.query(function(data){
    //
    //   // categorizeByNeighborhoods($scope.data.restaurants);
    // });

    // Neighborhood.query(function(data){
    //   console.log('Neighborhood Data:', data);
    //   renderNeighborhoodBoundaries(map, data);
    // });

    $scope.groups = [
      {
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
      },
      {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
      }
    ];

    // var categorizeByNeighborhoods = function(){
    //
    //
    //   var gjLayer = L.geoJson(stateJSON);
    //   console.log(gjLayer);
    //
    //   _($scope.data.restaurants).forEach(function(d){
    //     console.log(d);
    //     console.log(leafletPip.pointInLayer([d.Latitude, d.Longitude], gjLayer, true));
    //   }).value();
    // };


  };
}());
