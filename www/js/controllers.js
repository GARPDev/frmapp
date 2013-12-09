'use strict';

function tellAngular() {
    console.log("tellAngular call");
    var domElt = document.getElementById('view-container');
    var scope = angular.element(domElt).scope();
    scope.$apply(function() {
        scope.width = window.innerWidth;
        scope.height = window.innerHeight;
    });
    var nhRead = window.innerHeight - 210;
    var nhMsg = window.innerHeight - 400;
    $(".readingscrollregion").css("height", nhRead + "px");
    $(".msgscrollregion").css("height", nhMsg + "px");
}


//first call of tellAngular when the dom is loaded
document.addEventListener("DOMContentLoaded", tellAngular, false);

//calling tellAngular on resize event
window.onresize = tellAngular;


/* Controllers */
var frmControllers = angular.module('frmControllers', []);

frmControllers.controller('NavController', ['$scope', '$location',
  function($scope, $location) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };    
  }
]);

frmControllers.controller('ScheduleBarController', ['$scope', '$location','Readings', 'Messages','Lessons','scheudlarBarSharedService',
  function($scope, $location, Readings, Messages, Lessons, scheudlarBarSharedService) {

    $scope.lessons = Lessons.query();
    $scope.readings = Readings.query();
    $scope.messages = Messages.query();

	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
	
	$scope.itemSelect = function(item) {
		$scope.selected = item;
		scheudlarBarSharedService.selectItem(item);
    };

	$scope.isItemSelected = function(item) {
		if(item == $scope.selected) {
			return 1;
		} else {
			return 0;
		}
	};

	$scope.$on('handleDoneReadingItem', function() {
		var li = scheudlarBarSharedService.lessonIndex;
		var ri = scheudlarBarSharedService.readingIndex;
		
		if($scope.lessons[li].readings[ri].checked) {
			$scope.lessons[li].readings[ri].checked = 0;
		} else {
			$scope.lessons[li].readings[ri].checked = 1;
		}
	});
	
	$scope.isItemInProgress = function(item) {
		var readings = $scope.lessons[item].readings;
		
		var found = 0;
		var foundItem = _.findWhere(readings, {checked: 1});
		if(foundItem) {
			found = foundItem.checked;
		}
		return found;
	};

	
  }
]);


frmControllers.controller('FRMAppDashCtrl', ['$scope', 'Readings', 'Messages','Lessons','scheudlarBarSharedService',
  function($scope, Readings, Messages, Lessons, scheudlarBarSharedService) {
  
	$scope.lessons = Lessons.query();
    $scope.readings = Readings.query();
    $scope.messages = Messages.query();
	
	$scope.lessonIndex = 0;
	
	$scope.$on('handleSelectItem', function() {
		$scope.lessonIndex = scheudlarBarSharedService.lessonIndex;
	});       

    // Init height;
    var nhRead = window.innerHeight - 210;
    var nhMsg = window.innerHeight - 400;
    $(".readingscrollregion").css("height", nhRead + "px");
    $(".msgscrollregion").css("height", nhMsg + "px");

    
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
		var li = scheudlarBarSharedService.lessonIndex;
		scheudlarBarSharedService.doneReadingItem($index);
		if($scope.lessons[li].readings[$index].checked)
			$scope.lessons[li].readings[$index].checked=0;
		else $scope.lessons[li].readings[$index].checked=1;
    };
	
    $scope.isItemClicked = function ($index, selectedArray) {	
		var li = scheudlarBarSharedService.lessonIndex;
		return $scope.lessons[li].readings[$index].checked;
    }
    
  }
]);

frmControllers.controller('FRMReadingsCtrl', ['$scope', 'Readings', 'Messages',
  function($scope, Readings, Messages) {
    $scope.readings = Readings.query();
    $scope.messages = Messages.query();
    
    $('ul.nav').find('li').removeClass('active')
    $('#mainnav-readings').addClass('active');
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