'use strict';

/* IIFE */
/* Don't pollute the global scope! */
(function(){
  angular.module('app')
         .controller('MapController', ['$scope', '$q', 'Restaurant', 'Neighborhood', MapController]);

  function MapController($scope, $q, Restaurant, Neighborhood){
    $scope.data = {};

    L.mapbox.accessToken = 'pk.eyJ1Ijoia2VuY2hhbiIsImEiOiJpVTRzNG1RIn0.QDivyrM040Y1olXFj8UskA';

    var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
      attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });

    var map = L.map('map')
               .addLayer(mapboxTiles)
               .setView([40.706363, -74.009096], 13);

   $q.all([
     Restaurant.query().$promise,
     Neighborhood.query().$promise
   ]).then(function(result){
     console.log('Result', result);
     plotRestaurants(map, result[0]);
     renderNeighborhoodBoundaries(map, result[1]);
   });

    var plotRestaurants = function(map, data){
      var purpleMarker = L.AwesomeMarkers.icon({
        icon: 'cutlery',
        markerColor: 'purple'
      });

      _.forEach(data.Report[0], function(value, key){
        L.marker([value.Latitude, value.Longitude], {icon: purpleMarker})
         .bindPopup(value.Name)
         .addTo(map);
      });
    };

    var renderNeighborhoodBoundaries = function(map, data){
      var neighborhoodBoundaries = new L.geoJson();

      neighborhoodBoundaries.addTo(map);
      L.geoJson(data.features, {
        style: function(feature){
          return {
            color: 'rgba(105, 21, 73, 0.9)'
          }
        },
        onEachFeature: function(feature, layer){
          layer.bindPopup(feature.properties.neighborhood);

          // layer.on('mouseover', function(e){
          //   this.openPopup();
          // });
          //
          // layer.on('mouseout', function (e) {
          //   this.closePopup();
          // });
        }
      }).addTo(map);
    };
  };
}());
