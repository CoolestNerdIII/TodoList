angular.module('todolist.services', ['ngResource'])
	.factory('List', ['$resource', function ($resource) {
		return $resource('/api/lists/:id', {}, {
      'update': { method:'PUT' }
		});
	}])
  .factory('Item', ['$resource', function ($resource) {
		return $resource('/api/items/:id', {}, {
      'update': { method:'PUT' }
		});
	}]);
