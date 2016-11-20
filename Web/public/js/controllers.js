angular.module('todolist.controllers', [])
  .controller('ListCtrl', ['$scope', 'List', 'Item', '$uibModal', 'ngNotify', function ($scope, List, Item, $uibModal, ngNotify) {

    $scope.lists = [];

    $scope.openItem = function (item) {
      console.log(item);
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