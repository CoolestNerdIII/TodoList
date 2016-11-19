angular.module('todolist.services', ['ngResource'])
	.factory('List', ['$resource', function ($resource) {
		return $resource('/api/list/:id/');
	}])
  .factory('Item', ['$resource', function ($resource) {
		return $resource('/api/item/:id/');
	}]);
