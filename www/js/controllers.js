'use strict';

function tellAngular() {
    console.log("tellAngular call");
    var domElt = document.getElementById('view-container');
    var scope = angular.element(domElt).scope();
    scope.$apply(function() {
        scope.width = window.innerWidth;
        scope.height = window.innerHeight;
    });
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
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

frmControllers.controller('FRMAppLoginCtrl', ['$scope', '$location','remoteDataService',
  function($scope, $location, remoteDataService) {
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    $scope.clearData = function() {
      remoteDataService.clearData();
    }
  }
]);



frmControllers.controller('ScheduleBarController', ['$scope', '$location','Readings', 'Messages','Lessons','scheudlarBarSharedService','remoteDataService',
  function($scope, $location, Readings, Messages, Lessons, scheudlarBarSharedService, remoteDataService) {

    $scope.lessons = remoteDataService.data;
    $scope.readings = $scope.lessons[0].readings;

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

    $scope.filterMatch = function( criteria ) {
      return function( item ) {
        var li = scheudlarBarSharedService.lessonIndex;
        return $scope.lessons[li].readings[criteria.index][criteria.field] == criteria.value;
      };
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
  		var foundItem = _.where(readings, {checked: true});
  		if(foundItem.length > 0) {
  			found = 1;
  		}
  		return found;
  	};

  	$scope.isItemDone = function(item) {
  		var readings = $scope.lessons[item].readings;
  		
  		var allDone = 1;
  		var foundItem = _.where(readings, {checked: true});
  		if(foundItem.length != readings.length ) {
  			allDone = 0;
  		}
  		return allDone;
  	};

	
  }
]);


frmControllers.controller('FRMAppReadingsListCtrl', ['$scope','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, scheudlarBarSharedService, remoteDataService, readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.data;
    $scope.readings = $scope.lessons[0].readings;
    $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;

    // Readings List
    $scope.itemClicked = function (id, type) {
      var li = scheudlarBarSharedService.lessonIndex;
      var readings = $scope.lessons[li].readings;

      var found = 0;
      var foundItem = _.findWhere(readings, {id: id});

      foundItem[type]=!foundItem[type];
      remoteDataService.commitData();
    };
  
    $scope.isItemClicked = function (id, type) { 
      var li = scheudlarBarSharedService.lessonIndex;
      var readings = $scope.lessons[li].readings;

      var found = 0;
      var foundItem = _.findWhere(readings, {id: id});
      if(foundItem)
        return foundItem[type];
      else return 0;
    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;;
    }

    $scope.criteriaMatch = function(value) {
      return function( item ) {

        if(readlingListSharedService.filters.flagged && readlingListSharedService.filters.checked) {
          return (item.flagged === true && item.checked === true);
        } else if(readlingListSharedService.filters.flagged) {
          return item.flagged === true;
        } else if(readlingListSharedService.filters.checked) {
          return item.checked === true;
        } else {
          return 1;  
        }
        
      }
    }   

    $scope.$on('handleSelectItem', function() {
      if($scope.lessonIndex != scheudlarBarSharedService.lessonIndex) {
        $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;
        $('.readings-list-area').hide("fast", function() {
          $('.readings-list-area').show("fast", function() {
          //alert( "Animation complete." );
          });
        });
      }      

  });       


  }
]);


frmControllers.controller('FRMReadings', ['$scope','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, scheudlarBarSharedService, remoteDataService,readlingListSharedService) {
  
    //$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.data;
    $scope.readings = $scope.lessons[0].readings;
    $scope.lessonIndex = scheudlarBarSharedService.lessonIndex;;
    $scope.search = {};

    // For Readings
    $scope.selectedReadingArray = [];
    $scope.filterList = function(filterType,value) {

      readlingListSharedService.filterList(filterType);
      
    }

    $scope.getSelectedLesson = function ($index) { 
      var li = scheudlarBarSharedService.lessonIndex;
      return $scope.lessons[li].readings[$index];
    }

    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;
    }


    $scope.isFilterOn = function(type) {
      return readlingListSharedService.filters[type];
    }

  }
]);


frmControllers.controller('FRMAppDashCtrl', ['$scope', 'Readings', 'Messages','Lessons','scheudlarBarSharedService','remoteDataService','readlingListSharedService',
  function($scope, Readings, Messages, Lessons, scheudlarBarSharedService, remoteDataService, readlingListSharedService) {
  
  	//$scope.lessons = Lessons.query();
    $scope.lessons = remoteDataService.data;
    $scope.readings = $scope.lessons[0].readings;

    $scope.messages = Messages.query();
  	
  	$scope.lessonIndex = scheudlarBarSharedService.lessonIndex;

    readlingListSharedService.clearFilters();

    $scope.$watchCollection('lessons', function() { 
      //alert('change');
    });


    // Init height;
    var nhRead = window.innerHeight - 240;
    var nhMsg = window.innerHeight - 430;
    $(".readingscrollregion").css("height", nhRead + "px");
    $(".msgscrollregion").css("height", nhMsg + "px");

    
    $scope.go = function() {
      $scope.msgread = 'msgread';
    }
    
    // For Messages
    $scope.selectedMessageArray = [];

    $scope.getSelectedLesson = function ($index) { 
      var li = scheudlarBarSharedService.lessonIndex;
      return $scope.lessons[li].readings[$index];
    }
   
    $scope.getSelectedLessonIndex = function ($index) { 
      return scheudlarBarSharedService.lessonIndex;;
    }

  }
]);


frmControllers.controller('FRMReadingsCtrl', ['$scope',
  function($scope) {
    
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