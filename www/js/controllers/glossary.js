frmControllers.controller('FRMGlossaryCtrl', ['$scope','$timeout', '$location', 'remoteDataService','navigationService',
  function($scope, $timeout, $location, remoteDataService, navigationService) {

    $scope.searchTerms = remoteDataService.searchTerms;
    $scope.glossaryData = remoteDataService.glossaryData;

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);
  }
]);
