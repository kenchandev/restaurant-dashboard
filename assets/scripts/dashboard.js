'use strict';

/* IIFE */
/* Don't pollute the global scope! */
(function(){
  /*
   * $http proves to be low-level.
   * The $resource service returns a resource object with convenient methods mapping to their HTTP verbs' counterparts.
   * Must inject ui.bootstrap for accordion.
   */
  var app = angular.module('app', [
    'ngResource',
    'ngAnimate',
    'ui.bootstrap'
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
