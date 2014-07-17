frmControllers.controller('FRMAppAlertsCtrl', ['$scope','$timeout','remoteDataService','navigationService',
  function($scope, $timeout, remoteDataService, navigationService) {

    $scope.examSites = [];
    $scope.examSites = remoteDataService.examSites;

    $scope.title = '';
    $scope.message = '';
    $scope.sound = true;


    $timeout(function() {
      navigationService.pageTransitionIn();
      $('body').removeClass("modal-open")
    }, 0);


    
    $scope.matchSelected = function(value) {
      return function( item ) {
      	return item.selected;
      }
    }

  	$scope.selectItem = function(item) {		
  		item.selected = !item.selected;
    }

    $scope.sendMsg = function(msg) {    

      var sendSites = [];
      for(var i=0; i<$scope.examSites.length; i++) {
        if($scope.examSites[i].selected)
          sendSites.push($scope.examSites[i].Id);
      }

      remoteDataService.sendMsg($scope.title, $scope.message, $scope.sound, sendSites, function(err,data) {
        console.log(data);
        alert('Message Sent!');
      });
    }
  }
]);