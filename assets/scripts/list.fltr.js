'use strict';

/* IIFE */
/* Don't pollute the global scope! */
(function(){
  angular.module('app')
         .filter('startFrom', function(){
           return function(input, start){
              start = +start; // Parse to int types.
              return input.slice(start);
           }
         });
}());
