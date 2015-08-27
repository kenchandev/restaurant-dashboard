'use strict';

/* IIFE */
/* Don't pollute the global scope! */
(function(){
  var app = angular.module('app', [
    'ngResource'
  ]);

  app.factory('Restaurant', ['$resource', function($resource){
    return $resource('assets/data/servy_data.json', {}, {
      query: { method: 'GET', isArray: false }
    });
  }]);

  app.factory('Neighborhood', ['$resource', function($resource){
    return $resource('assets/data/nyc_neighborhoods.geojson', {}, {
      query: { method: 'GET', isArray: false }
    });
  }]);
}());
