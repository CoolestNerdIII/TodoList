angular.module('todolist.controllers', [])
  .controller('ListCtrl', ['$scope', 'List', function ($scope, List) {
    "use strict";
    console.log('Hello');

    List.query(function (resp) {
      console.log(resp);
    }, function (err) {
      console.error(err);
    })
  }]);