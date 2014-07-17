frmControllers.controller('FRMAppAlertsCtrl', ['$scope','$timeout','remoteDataService','navigationService',
  function($scope, $timeout, remoteDataService, navigationService) {

    $scope.examSites = [];

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);
  }
]);