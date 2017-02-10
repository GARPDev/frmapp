frmControllers.controller('FRMGlossaryCtrl', ['$scope','$timeout', '$location', 'remoteDataService','navigationService', '$routeParams',
  function($scope, $timeout, $location, remoteDataService, navigationService, $routeParams) {

    $scope.searchTerms = ($routeParams.searchString !== undefined && $routeParams) ? $routeParams.searchString : null
    $scope.glossaryData = remoteDataService.glossaryData;

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);
  }
]);
