frmControllers.controller('FRMAppAlertsCtrl', ['$scope','$timeout','remoteDataService','navigationService',
  function($scope, $timeout, remoteDataService, navigationService) {

    $scope.examSites = [];
    $scope.examSites = remoteDataService.examSites;

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);
  }
]);