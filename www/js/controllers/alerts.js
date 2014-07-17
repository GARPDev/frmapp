frmControllers.controller('FRMAppAlertsCtrl', ['$scope','$timeout','remoteDataService','navigationService',
  function($scope, $timeout, remoteDataService, navigationService) {

    $scope.examSites = [];
    $scope.examSites = remoteDataService.examSites;

    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);


    
    $scope.criteriaMatch = function(value) {
      return function( item ) {
      	return item.selected;
      }
    }

  	$scope.selectItem = function(item) {		
  		!item.selected;
    }
  }
]);