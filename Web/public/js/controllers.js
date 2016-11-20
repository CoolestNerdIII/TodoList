angular.module('todolist.controllers', [])
  .controller('ParentCtrl', ['$scope', '$rootScope', '$uibModal', 'List', function ($scope, $rootScope, $uibModal, List) {
    $scope.newList = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/modals/new-list-modal.html',
        controller: 'BasicModalCtrl',
        size: 'lg'
      });

      modalInstance.result.then(function (resp) {
        if (resp) {
          var list = new List(resp);
          list.$save(function (resp) {
            $rootScope.$broadcast('NEW_LIST_ADDED', resp);
          }, function (err) {
            console.error(err);
          })
        }
      });
    }
  }])
  .controller('ListCtrl', ['$scope', '$rootScope', 'List', 'Item', '$uibModal', 'ngNotify', function ($scope, $rootScope, List, Item, $uibModal, ngNotify) {

    $scope.lists = [];
    $scope.archived = [];
    $scope.active = [];
    $scope.newItem = '';

    $rootScope.$on('NEW_LIST_ADDED', function (event, list) {
      $scope.lists.unshift(list);
    });

    $scope.editList = function (list) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/modals/list-detail-modal.html',
        controller: 'EditItemModalCtrl',
        size: 'lg',
        resolve: {
          item: list
        }
      });

      modalInstance.result.then(function (resp) {
        if (resp) {
          List.update({id: list._id}, resp, function (resp) {
            // Item updated
          }, function (err) {
            console.error(err);
          })
        }
      });
    };

    $scope.removeList = function (list) {
      if (list.archived) {
        List.delete({id: list._id}, function () {
          ngNotify.set('List deleted', 'success');
        }, function (err) {
          ngNotify.set(err, 'danger');
        })
      } else {
        list.archived = true;
        List.update({id: list._id}, list, function () {
          ngNotify.set('List archived', 'success');
          $scope.archived.push(list);
        }, function (err) {
          ngNotify.set(err, 'danger');
        })
      }
    };

    $scope.restoreList = function (list) {
      if (list.archived) {
        list.archived = false;
        List.update({id: list._id}, list, function () {
          ngNotify.set('List restored', 'success');
          $scope.active.push(list);
        }, function (err) {
          ngNotify.set(err, 'danger');
        })
      }
    };

    $scope.addItem = function (item, list_id, list_index) {
      var newItem = new Item({text:item, list: list_id});
      newItem.$save(function (resp) {
        var list = $scope.lists[list_index];
        if (!list.items) {
          list.items = [];
        }
        $scope.lists[list_index].items.push(resp);
        $scope.newItem = '';
      }, function (err) {
        console.error(err);
      });
    };

    $scope.setClickedRow = function(index, item){  //function that sets the value of selectedRow to current index
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/modals/item-detail-modal.html',
        controller: 'EditItemModalCtrl',
        size: 'lg',
        resolve: {
          item: item
        }
      });

      modalInstance.result.then(function (resp) {
        if (resp) {
          Item.update({id: item._id}, resp, function (resp) {
            // Item updated
          }, function (err) {
            console.error(err);
          })
        }
      });

    };

    $scope.removeItem = function (event, item, list_index, idx) {
      event.preventDefault();
      event.stopPropagation();

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/modals/confirm-deletion-modal.html',
        controller: 'BasicModalCtrl',
        size: 'lg'
      });

      modalInstance.result.then(function (resp) {
        if (resp) {
          Item.delete({id: item._id}, function () {
            $scope.lists[list_index].items.splice(idx, 1);
          }, function (err) {
            ngNotify.set('Unable to delete item', 'danger');
            console.error(err);
          })
        }
      });
    };

    $scope.toggleCompletion = function (event, item) {
      event.stopPropagation();
      item.isComplete = !item.isComplete;

      Item.update({id: item._id}, item, function (resp) {
        // Item updated
      }, function (err) {
        console.error(err);
      })
    };

    $scope.getClass = function (item) {
      var today = new Date();
      if (item.isComplete || !item.dueDate) {
        return '';
      } else if (item.dueDate < new Date()) {
        return 'danger';
      }
      // else if (item.dueDate < new Date().setDate(today.getDate()-30)) {
      //   return 'warning';
      // }

      return '';
    };

    List.query(function (resp) {
      $scope.lists = resp;
      $scope.lists.forEach(function (list) {
        if (list.archived) {
          $scope.archived.push(list);
        } else {
          $scope.active.push(list);
        }
      })
    }, function (err) {
      console.error(err);
    })
  }])
  .controller('BasicModalCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
    $scope.ok = function (result) {
      $uibModalInstance.close(result);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }])
  .controller('EditItemModalCtrl', ['$scope', '$uibModalInstance', 'item', function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function (result) {
      $uibModalInstance.close(result);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);