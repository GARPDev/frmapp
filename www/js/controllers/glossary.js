frmControllers.controller('FRMGlossaryCtrl', ['$scope','$timeout','remoteDataService','navigationService',
  function($scope, $timeout, remoteDataService, navigationService) {

    $scope.searchTerms = remoteDataService.searchTerms;
    $scope.glossaryData = remoteDataService.glossaryData;

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);
  }
]);
