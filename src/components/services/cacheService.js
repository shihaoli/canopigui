angular.module('canopi.service').factory( 'Cache', ['$cacheFactory', function($cacheFactory) {
	
	'use strict';
	
	var cache = $cacheFactory('myCache');
	
	return cache;

}]);

