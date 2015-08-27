'use strict';

/* IIFE */
(function(){
  var app = angular.module('app', [
    'ngResource'
  ]);

  app.controller('MapController', ['$scope', 'Neighborhood', function($scope, Neighborhood){
    $scope.data = {};

    L.mapbox.accessToken = 'pk.eyJ1Ijoia2VuY2hhbiIsImEiOiJpVTRzNG1RIn0.QDivyrM040Y1olXFj8UskA';

    var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
      attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });

    var map = L.map('map')
               .addLayer(mapboxTiles)
               .setView([40.706363, -74.009096], 13);

    Neighborhood.query(function(data){
      console.log(data);
      $scope.data.neighborhood = data;
      renderNeighborhoodBoundaries(map, data);
    })

    var renderNeighborhoodBoundaries = function(map, data){
      var neighborhoodBoundaries = new L.geoJson();

      neighborhoodBoundaries.addTo(map);
      L.geoJson(data.features, {
        style: function(feature){
          return {
            color: 'rgba(0, 0, 0, 0.8)'
          }
        }
      }).addTo(map);
    };
  }]);

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
