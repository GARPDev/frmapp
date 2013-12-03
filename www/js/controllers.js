'use strict';

/* Controllers */

var frmControllers = angular.module('frmControllers', []);

frmControllers.controller('FRMAppDashCtrl', ['$scope', 'Readings', 'Messages',
  function($scope, Readings, Messages) {
    $scope.readings = Readings.query();
	$scope.messages = Messages.query();
	
	$scope.go = function() {
		$scope.msgread = 'msgread';
    }

	//Progress
	$scope.progressCnt=0;
	$scope.progressStyle={width: $scope.progressCnt + '%'};
	
	// For Messages
	$scope.selectedMessageArray = [];
	// For Readings
	$scope.selectedReadingArray = [];

	$scope.itemClicked = function ($index, selectedArray, showProgress) {
		var value = selectedArray.indexOf($index);
		console.log($index + ":" + value);
		if(value >= 0) {
			
			selectedArray.splice(value, 1);
			if(showProgress) {
				$scope.progressCnt-=10;
				$scope.progressStyle={width: $scope.progressCnt + '%'};
			}
		} else {
			selectedArray.push($index);
			if(showProgress) {
				$scope.progressCnt+=10;
				$scope.progressStyle={width: $scope.progressCnt + '%'};
			}
		}
		
	};
	$scope.isItemClicked = function ($index, selectedArray) {
		return selectedArray.indexOf($index);
	}
  
  }
]);

/*
frmControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);
*/