angular.module('todolist.controllers', [])
  .controller('ParentCtrl', ['$scope', '$uibModal', 'List', function ($scope, $uibModal, List) {
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
            console.log(resp);
          }, function (err) {
            console.error(err);
          })
        }
      });
    }
  }])
  .controller('ListCtrl', ['$scope', 'List', 'Item', '$uibModal', 'ngNotify', function ($scope, List, Item, $uibModal, ngNotify) {

    $scope.lists = [];
    $scope.newItem = '';

    $scope.addItem = function (item, list_id, list_index) {
      var newItem = new Item({text:item, list: list_id});
      newItem.$save(function (resp) {
        $scope.lists[list_index].items.push(resp);
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
          Item.update({id: item._id}, item, function (resp) {
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
      console.log(resp);
      $scope.lists = resp;
    }, function (err) {
      console.error(err);
    })
  }])
  /**
   * Modal for basic yes/no results
   */
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