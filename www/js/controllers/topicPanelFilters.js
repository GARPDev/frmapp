frmControllers.controller('TopicPanelFiltersController', ['$scope', 'readlingListSharedService',
  function($scope, readlingListSharedService) {


    $scope.isFilterOn = function(type) {
      return readlingListSharedService.filters[type];
    }

    $scope.filterList = function(type,value) {
      readlingListSharedService.filterList(type);
    }

  }
]);
